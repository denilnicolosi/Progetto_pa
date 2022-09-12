import Jwt from 'jsonwebtoken'
import * as modelUser from '../models/userModel'
import * as modelMatches from '../models/matchesModel'
import * as modelMoves from '../models/movesModel'
import {ErrorFactory} from '../factory/ErrorMessage'
import {SuccessFactory} from '../factory/SuccessMessage'
import {ErrorEnum, Message, SuccessEnum} from '../factory/Message'

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
                    console.log("Challenger not found or player are tring to play with himself")
                    result = errorFactory.getError(ErrorEnum.EmailNotValidAddress).getResponse()
                } else {
                    //challenger is one of the register user, check if him has opened match
                    const challengerOpenMatch = await modelMatches.getOpenMatchByUser(challenger)
                    if(challengerOpenMatch != null){   
                        //challenger has opened match, let's return a error
                        console.log("Challenger has opened match")
                        result = errorFactory.getError(ErrorEnum.CreateMatchNotAllowed).getResponse()
                    }
                }
            }       
        } else {
            //player has opened match, return a error
            console.log("Player has opened match")
            result = errorFactory.getError(ErrorEnum.CreateMatchNotAllowed).getResponse()
        }

        if(result===undefined){ //there is no error in the checks above

            //check if the user has token to open the match
            const token:any=await modelUser.getToken(player)
           
            // console.log(Number(token.users.dataValues.token))
            if(token != null && Number(token.token)>=0.40){
                
                //decrese token for player1
                await modelUser.setToken(player, (Number(token.token)-0.40)) 

                console.log(player + " vs " + challenger)
                const game = new jsChessEngine.Game()
                const boardConfiguration = JSON.stringify(game.exportJson())
                const match:any = await modelMatches.insertNewMatch(player, challenger)
                await modelMoves.insertMove(match.matchid, null, null, boardConfiguration)

                console.log("Creata partita: " + match.matchid)
                result = successFactory.getSuccess(SuccessEnum.CreateMatchSuccess).getResponse()
                result.data = { "matchid" : match.matchid} 
            }
            else
            {
                console.log("The player does not have enough tokens")
                result = errorFactory.getError(ErrorEnum.NotEnoughToken).getResponse()
            }   
        }

    }catch(err){
        console.log("Error opening match"+err)
        result = errorFactory.getError(ErrorEnum.CreateMatchError).getResponse()
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
              
        if((player == playerOpenMatch.player1 && boardConfiguration.turn =="white") || (player == playerOpenMatch.player2 && boardConfiguration.turn =="black")){
            //check turn. Player1 is always white and Player2 is always black
            
            //do the move for the player
            var boardConfiguration:any = await doMove(playerOpenMatch.matchid, playerOpenMatch.player1, req.body.moveFrom, req.body.moveTo)
                     
            if(boardConfiguration === null){
                //failed to update database
                result = errorFactory.getError(ErrorEnum.MoveError).getResponse()
                result.data = {}
            } else {
                //update database success
                //if player2 is null, the game is vs AI
                if(playerOpenMatch.player2 === null){
                    
                    var aiMove = jsChessEngine.aiMove(boardConfiguration, req.body.level)
                    const aiMoveFrom = Object.keys(aiMove)[0]
                    const aiMoveTo = <string> Object.values(aiMove)[0]

                    boardConfiguration = await doMove(playerOpenMatch.matchid, playerOpenMatch.player1, aiMoveFrom, aiMoveTo)
                    if(boardConfiguration === null){
                        //failed to update database
                        result = errorFactory.getError(ErrorEnum.MoveError).getResponse()
                        result.data = {}
                    }else{
                        //update successfully
                        result = successFactory.getSuccess(SuccessEnum.MoveSuccess).getResponse()
                        result.data = {"nextTurn" : boardConfiguration.turn}
                    }

                }else{
                    //update successfully
                    result = successFactory.getSuccess(SuccessEnum.MoveSuccess).getResponse()
                    result.data = {"nextTurn" : boardConfiguration.turn}
                }
            }
        } else {
            //move not allowed, return error
            result = errorFactory.getError(ErrorEnum.MoveNotAllowedError).getResponse()
            result.data = {}        
        }

    } catch(e:any){
        //move not allowed, return error
        result = errorFactory.getError(ErrorEnum.MoveNotAllowedError).getResponse()
        console.log(e.message)        
    }
   
    return result
}

export async function doMove(matchid:any ,playerDecreaseToken:string, moveFrom:string, moveTo:string){
    //decrese token to player 1
    decreseTokenMove(playerDecreaseToken)
    //get lastBoard configuration to do move
    var boardConfiguration = await modelMoves.getLastBoardConfiguration(matchid)    
    //do the move
    var boardConfiguration = jsChessEngine.move(boardConfiguration, moveFrom, moveTo)
    //insert the move in history
    var insertMovesResult = await modelMoves.insertMove(matchid, moveFrom, moveTo, JSON.stringify(boardConfiguration))
    //print to console
    printToConsole(boardConfiguration) 

    if(insertMovesResult)
        return boardConfiguration
    else 
        return null    
}

export function printToConsole(boardConfiguration:any){
    const game = new jsChessEngine.Game(boardConfiguration)
    game.printToConsole()
}

export async function playedMatch(req:any, res:any) {
    var result:any
    //get user email from jwt
    const decoded:any = <string>Jwt.decode(req.headers.authorization)
    var player = decoded.email
    try{
        const matches = JSON.parse(await modelMatches.getMatchesByUser(player, req.body.dateFrom, req.body.dateTo))
        result = successFactory.getSuccess(SuccessEnum.PlayedMatchSuccess).getResponse()
        result.data = {"matches" : matches}

    } catch(err){
        result = errorFactory.getError(ErrorEnum.PlayedMatchBadRequest).getResponse()
        result.data = {}
    }
    return result
}

export async function statusMatch(req:any, res:any){
    var result:any
    const matchId = req.body.matchId
    try{
        const match = JSON.parse(await modelMatches.getMatchesById(matchId))
        const boardConfiguration = await modelMoves.getLastBoardConfiguration(matchId)
        result = successFactory.getSuccess(SuccessEnum.StatusMatchSuccess).getResponse()
        result.data = boardConfiguration
    } catch(err){
        result = errorFactory.getError(ErrorEnum.StatusMatchError).getResponse()
        result.data = {}
    }
    return result
}
export async function decreseTokenMove(player:string) {
    //decrese token for move
    const token:any=await modelUser.getToken(player) 
    await modelUser.setToken(player, (Number(token.token)-0.01))   
}

export async function historyMoves(req:any, res:any) {
    var result:any
    const matchId = req.body.matchId
    try{
        const history:any = await modelMoves.getHistoryFromMatch(matchId)
        
        var i = 0
        for (let elem of history) {
            elem.moveid = i
            i = i + 1;
            if (req.body.type == "FEN"){
                
                elem.boardConfiguration = getFen(JSON.parse(elem.boardConfiguration))
            }
        }  

        result = successFactory.getSuccess(SuccessEnum.HistoryMovesSuccess).getResponse()
        result.data = {"history": history}
    } catch(err){
        result = errorFactory.getError(ErrorEnum.StatusMatchError).getResponse()
        console.log(err)
        result.data = {}
    }
    return result
}

export async function playersRank(req:any, res:any) {
    var result:any
    try{
        const stats = await modelMatches.getStats()
        result = successFactory.getSuccess(SuccessEnum.PlayersRankSuccess).getResponse()
        result.data = {"playersRank" : stats}
    } catch(err){
        result = errorFactory.getError(ErrorEnum.PlayerRankError).getResponse()
        result.data = {}
    }
    return result
}

export async function endMatch(req:any, res:any) {
    var result:any
    try{
        const decoded:any = <string>Jwt.decode(req.headers.authorization)
        var player = decoded.email
        const playerOpenMatch:any = await modelMatches.getOpenMatchByUser(player)

        if(playerOpenMatch){
            if(playerOpenMatch.player2 === null){
                await modelMatches.setState(playerOpenMatch.matchid, "close")
                result = successFactory.getSuccess(SuccessEnum.EndMatchSuccessClose).getResponse()
            } else {
                
                //check state of match 
                const status = await modelMatches.getState(playerOpenMatch.matchid)

                if(status == "close_request_player1" && player == playerOpenMatch.player2 ||
                  status == "close_request_player2" && player == playerOpenMatch.player1){
                   
                    await modelMatches.setState(playerOpenMatch.matchid,"close")
                    result = successFactory.getSuccess(SuccessEnum.EndMatchSuccessClose).getResponse()
                }else if(status== "open" && player == playerOpenMatch.player1)
                {
                    await modelMatches.setState(playerOpenMatch.matchid,"close_request_player1")
                    result = successFactory.getSuccess(SuccessEnum.EndMatchSuccessCloseRequest1).getResponse()
                } else if(status== "open" && player == playerOpenMatch.player2)
                {
                    await modelMatches.setState(playerOpenMatch.matchid,"close_request_player2")
                    result = successFactory.getSuccess(SuccessEnum.EndMatchSuccessCloseRequest2).getResponse()
                }else{
                    result = errorFactory.getError(ErrorEnum.WaitEndMatch).getResponse()
                }
            }

        } else {
            result = errorFactory.getError(ErrorEnum.EndMatchBadRequest).getResponse()
        }   

    }catch(err){
        result = errorFactory.getError(ErrorEnum.EndMatchError).getResponse()
        console.log(err)
        result.data = {}
    }

    return result
}