import Jwt from 'jsonwebtoken'
import * as modelUser from '../models/userModel'
import * as modelMatches from '../models/matchesModel'
import * as modelMoves from '../models/movesModel'
import {ErrorFactory} from '../factory/ErrorMessage'
import {SuccessFactory} from '../factory/SuccessMessage'
import {ErrorEnum, Message, Response, SuccessEnum} from '../factory/Message'

const errorFactory: ErrorFactory = new ErrorFactory();
const successFactory: SuccessFactory = new SuccessFactory();
const jsChessEngine = require('js-chess-engine')
const { getFen } = jsChessEngine



export async function newMatch(req:any, res:any){
    var result:any
    try{
        //get user email from jwt
        const decoded:any = <string>Jwt.decode(req.headers.authorization)
        var player = decoded.email
        let challenger = req.body.vs
        //check if player has no match open
        const playerOpenMatch = await modelMatches.getOpenMatchByUser(player)
        if(playerOpenMatch==null){
            //player has no opened match
            if(challenger !== "AI"){           
                //challenger isn't AI, check on DB if challenger is one of the registred user
                let user = await modelUser.getUser(challenger)
                if(user==null || player == challenger){
                    //challenger isn't one of the registred user so return error
                    console.log("Challenger not found or player are trying to play with himself")
                    result = errorFactory.getMessage(ErrorEnum.EmailNotValidAddress).getResponse()
                } else {
                    //challenger is one of the register user, check if him has opened match
                    const challengerOpenMatch = await modelMatches.getOpenMatchByUser(challenger)
                    if(challengerOpenMatch != null){   
                        //challenger has opened match, let's return a error
                        console.log("Challenger has opened match")
                        result = errorFactory.getMessage(ErrorEnum.CreateMatchNotAllowed).getResponse()
                    }
                }
            }       
        } else {
            //player has opened match, return a error
            console.log("Player has opened match")
            result = errorFactory.getMessage(ErrorEnum.CreateMatchNotAllowed).getResponse()
        }

        if(result===undefined){ //there is no error in the checks above

            //check if the user has token to open the match
            const token:any=await modelUser.getToken(player)
           
            if(token != null && Number(token.token)>=0.40){
                
                //decrese token for player1
                await modelUser.setToken(player, (Number(token.token)-0.40)) 

                console.log(player + " vs " + challenger)
                //get clean new board configuration
                const game = new jsChessEngine.Game()
                const boardConfiguration = JSON.stringify(game.exportJson())
                //create new match on DB
                const match:any = await modelMatches.insertNewMatch(player, challenger)
                //create init move
                await modelMoves.insertMove(match.matchid, null, null, boardConfiguration)
                //compose result
                console.log("Creata partita: " + match.matchid)
                result = successFactory.getMessage(SuccessEnum.CreateMatchSuccess).getResponse()
                result.data = { "matchid" : match.matchid} 
            }
            else
            {
                //The player does not have enough tokens
                console.log("The player does not have enough tokens")
                result = errorFactory.getMessage(ErrorEnum.NotEnoughToken).getResponse()
            }   
        }

    }catch(err){
        //generic error
        console.log("Error opening match: "+err)
        result = errorFactory.getMessage(ErrorEnum.CreateMatchError).getResponse()
    }

    return result
}

export async function move(req:any, res:any){
    var result:any

    try{

        //get user email from jwt
        const decoded:any = <string>Jwt.decode(req.headers.authorization)
        var player = decoded.email

        //get the open match for the player
        const playerOpenMatch:any = await modelMatches.getOpenMatchByUser(player)
        var boardConfiguration= await modelMoves.getLastBoardConfiguration(playerOpenMatch.matchid)
        //if the match is vs AI check if AI move level is between 0 and 4
        if(playerOpenMatch.player2 !== null || (req.body.level >= 0 && req.body.level <=4) ){
            
            if((player == playerOpenMatch.player1 && boardConfiguration.turn =="white") || (player == playerOpenMatch.player2 && boardConfiguration.turn =="black")){
                //check turn. Player1 is always white and Player2 is always black
                
                //do the move for the player
                var boardConfiguration:any = await doMove(playerOpenMatch.matchid, playerOpenMatch.player1, req.body.moveFrom, req.body.moveTo)
                        
                if(boardConfiguration !== null){                  
                    //update database success
                    
                    //check the winner after player move
                    const matchResult = await checkWinner(boardConfiguration, playerOpenMatch)
                    
                    if(matchResult == null){
                        //there is no winner
                        //if player2 is null, the game is vs AI
                        if(playerOpenMatch.player2 === null){                                            
                            //move AI
                            var aiMove = jsChessEngine.aiMove(boardConfiguration, req.body.level)
                            const aiMoveFrom = Object.keys(aiMove)[0]
                            const aiMoveTo = <string> Object.values(aiMove)[0]

                            boardConfiguration = await doMove(playerOpenMatch.matchid, playerOpenMatch.player1, aiMoveFrom, aiMoveTo)
                            
                            if(boardConfiguration !== null ){
                                //update successfully
                                result = successFactory.getMessage(SuccessEnum.MoveSuccess).getResponse()
                                //check the winner after AI move
                                const matchResult = await checkWinner(boardConfiguration, playerOpenMatch)
                                if(matchResult == null){
                                    result.data = {"nextTurn" : boardConfiguration.turn}
                                } else {
                                    result.data = {"winner" : matchResult}
                                }
                            }else{
                                //failed to update database
                                result = errorFactory.getMessage(ErrorEnum.MoveError).getResponse()                              
                            }
                        }else{
                            //next turn to other player
                            result = successFactory.getMessage(SuccessEnum.MoveSuccess).getResponse()
                            result.data = {"nextTurn" : boardConfiguration.turn}
                        }        
                    } else {
                        //there is a winner!
                        result = successFactory.getMessage(SuccessEnum.MoveSuccess).getResponse()
                        result.data = {"winner" : matchResult}
                    }
                }else{
                 //failed to update database
                 result = errorFactory.getMessage(ErrorEnum.MoveError).getResponse()               
                }
            } else {
                //Not your turn
                result = errorFactory.getMessage(ErrorEnum.NotYourTurn).getResponse()               
            }
        }else{  
            //the move request for AI has no correct level          
            result = errorFactory.getMessage(ErrorEnum.MoveBadRequest).getResponse()            
        }

    } catch(e:any){
        //move not allowed, return error
        result = errorFactory.getMessage(ErrorEnum.MoveNotAllowedError).getResponse()
        console.log(e.message)        
    }
   
    return result
}

export async function checkWinner(boardConfiguration:any, playerOpenMatch:any){
    var winner = null
    if(boardConfiguration.isFinished){
        //the match is finished, so check the winner

        //set match closed
        await modelMatches.setState(playerOpenMatch.matchid, "close")
        if(boardConfiguration.checkMate){
            //check if there is a checkmate in the board
            if(boardConfiguration.turn == "white"){
                //if the turn is white, it means that black has made a checkmate in the previous move
                winner = "black"
                if(playerOpenMatch.player2 === null){
                    //winner AI
                    await modelMatches.setWinner(playerOpenMatch.matchid, "AI")
                }else{
                    //winner player2
                    await modelMatches.setWinner(playerOpenMatch.matchid, playerOpenMatch.player2)
                    //add 1 token to winner
                    increaseToken(playerOpenMatch.player2,1)
                }
            } else {
                //else it means that white has made a checkmate in the previous move
                winner = "white"
                //set winner white
                await modelMatches.setWinner(playerOpenMatch.matchid, playerOpenMatch.player1)
                //add 1 token to winner
                increaseToken(playerOpenMatch.player1,1)
            }
        } else {
            //draw
            winner = "draw"
            await modelMatches.setWinner(playerOpenMatch.matchid, "draw")
        }
    }
    return winner
}


export async function doMove(matchid:any ,playerDecreaseToken:string, moveFrom:string, moveTo:string){
    //decrese token to player 1
    decreseToken(playerDecreaseToken, 0.01)
    //get lastBoard configuration to do move
    var boardConfiguration = await modelMoves.getLastBoardConfiguration(matchid)    
    //do the move
    var boardConfiguration = jsChessEngine.move(boardConfiguration, moveFrom, moveTo)
    //insert the move in history
    var insertMovesResult = await modelMoves.insertMove(matchid, moveFrom, moveTo, JSON.stringify(boardConfiguration))
    //print to console
    printToConsole(boardConfiguration) 
    //If the move was entered correctly return boardConfiguration else return null
    if(insertMovesResult)
        return boardConfiguration
    else 
        return null    
}

export function printToConsole(boardConfiguration:any){
    //print cheesBoard on the console
    const game = new jsChessEngine.Game(boardConfiguration)
    game.printToConsole()
}

export async function playedMatch(req:any, res:any) {
    var result:any
    //get user email from jwt
    const decoded:any = <string>Jwt.decode(req.headers.authorization)
    var player = decoded.email
    try{
        //get matches list by user
        const matches = JSON.parse(await modelMatches.getMatchesByUser(player, req.body.dateFrom, req.body.dateTo))
        //for each matches get the move list
        for(var elem of matches){
            elem.movesCount = await modelMoves.getMovesCountByMatch(elem.matchid)
        }
        //compose result witch the matches list
        result = successFactory.getMessage(SuccessEnum.PlayedMatchSuccess).getResponse()
        result.data = {"matches" : matches}

    } catch(err){
        //return error
        result = errorFactory.getMessage(ErrorEnum.PlayedMatchError).getResponse()        
    }
    return result
}

export async function statusMatch(req:any, res:any){
    var result:any
    //get matchId from request
    const matchId = req.body.matchId
    try{
        //get match status from DB
        const match = JSON.parse(await modelMatches.getMatchesById(matchId))
        //get last board configuration from DB
        const boardConfiguration = await modelMoves.getLastBoardConfiguration(matchId)
        //compose result
        result = successFactory.getMessage(SuccessEnum.StatusMatchSuccess).getResponse()
        result.data = boardConfiguration
    } catch(err){
        //compose error
        result = errorFactory.getMessage(ErrorEnum.StatusMatchError).getResponse()        
    }
    return result
}
export async function decreseToken(player:string, decrese:number) {
    //decrese token for move
    const token:any=await modelUser.getToken(player) 
    await modelUser.setToken(player, (Number(token.token)-decrese))   
}

export async function increaseToken(player:string, increase:number) {
    //increase token for move
    const token:any=await modelUser.getToken(player) 
    await modelUser.setToken(player, (Number(token.token)+increase))   
}

export async function historyMoves(req:any, res:any) {
    //get history moves from match
    var result:any
    const matchId = req.body.matchId
    try{
        //get history by matches from DB
        const history:any = await modelMoves.getHistoryFromMatch(matchId)
        
        var i = 0
        for (let elem of history) {
            //rewrite the moveid to make it contextual to the current match
            elem.moveid = i
            i = i + 1;
            //if user have requested the FEN notation for the cheesboard do the conversion
            if (req.body.type == "FEN"){
                elem.boardConfiguration = getFen(JSON.parse(elem.boardConfiguration))
            }
        }  
        //compose the move history 
        result = successFactory.getMessage(SuccessEnum.HistoryMovesSuccess).getResponse()
        result.data = {"history": history}
    } catch(err){
        //compose error
        result = errorFactory.getMessage(ErrorEnum.HistoryMovesError).getResponse()
        console.log(err)        
    }
    return result
}

export async function playersRank(req:any, res:any) {
    //create the playersRank classify
    var result:any
    try{
        //get players classify from the DB
        const stats = await modelMatches.getStats(req.body.order)
        //compose result
        result = successFactory.getMessage(SuccessEnum.PlayersRankSuccess).getResponse()
        result.data = {"playersRank" : stats}
    } catch(err){
        //compose error
        result = errorFactory.getMessage(ErrorEnum.PlayerRankError).getResponse()
    }
    return result
}

export async function endMatch(req:any, res:any) {
    //request the end match
    var result:any
    try{
        //get player from jwt
        const decoded:any = <string>Jwt.decode(req.headers.authorization)
        var player = decoded.email
        //get open match by user
        const playerOpenMatch:any = await modelMatches.getOpenMatchByUser(player)

        //check if the user has open match to end it
        if(playerOpenMatch){
            if(playerOpenMatch.player2 === null){
                //the player2 is AI, so we can close the game immediately
                await modelMatches.setState(playerOpenMatch.matchid, "close")
                result = successFactory.getMessage(SuccessEnum.EndMatchSuccessClose).getResponse()
            } else {
                
                //check state of match 
                const status = await modelMatches.getState(playerOpenMatch.matchid)

                //check if the status is in close request by player1, and we receive the request from player2 or vice versa
                if(status == "close_request_player1" && player == playerOpenMatch.player2 ||
                  status == "close_request_player2" && player == playerOpenMatch.player1){
                   
                    //now we can set the match to close  
                    await modelMatches.setState(playerOpenMatch.matchid,"close")
                    result = successFactory.getMessage(SuccessEnum.EndMatchSuccessClose).getResponse()

                    //increase token 0.1 for both player for having closed the game by mutual agreement
                    increaseToken(playerOpenMatch.player1,0.1)
                    increaseToken(playerOpenMatch.player2,0.1)

                }else if(status== "open" && player == playerOpenMatch.player1)
                {
                    //if the match is open and we recive the request from player1, set status to close request from player1
                    await modelMatches.setState(playerOpenMatch.matchid,"close_request_player1")
                    result = successFactory.getMessage(SuccessEnum.EndMatchSuccessCloseRequest1).getResponse()
                } else if(status== "open" && player == playerOpenMatch.player2)
                {
                    //if the match is open and we recive the request from player2, set status to close request from player2
                    await modelMatches.setState(playerOpenMatch.matchid,"close_request_player2")
                    result = successFactory.getMessage(SuccessEnum.EndMatchSuccessCloseRequest2).getResponse()
                }else{
                    //Wait that the other player confirm yout close request
                    result = errorFactory.getMessage(ErrorEnum.WaitEndMatch).getResponse()
                }
            }

        } else {
            //the player has no open match, so it is bad request
            result = errorFactory.getMessage(ErrorEnum.EndMatchBadRequest).getResponse()
        }   

    }catch(err){
        //compose the error
        result = errorFactory.getMessage(ErrorEnum.EndMatchError).getResponse()
        console.log(err)        
    }

    return result
}