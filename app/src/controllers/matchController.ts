import Jwt from 'jsonwebtoken'
import * as modelUser from '../models/userModel'
import * as modelMatches from '../models/matchesModel'
import {ErrorFactory} from '../factory/ErrorMessage'
import {SuccessFactory} from '../factory/SuccessMessage'
import {ErrorEnum, Message, SuccessEnum} from '../factory/Message'

const errorFactory: ErrorFactory = new ErrorFactory();
const successFactory: SuccessFactory = new SuccessFactory();
const jsChessEngine = require('js-chess-engine')

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
                const stato = JSON.stringify(game.exportJson())
                const match:any = await modelMatches.insertNewMatch(player, challenger, stato)
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
        console.log(playerOpenMatch)
        var boardConfiguration = JSON.parse(playerOpenMatch.dati)

        if((player == playerOpenMatch.player1 && boardConfiguration.turn =="white") || (player == playerOpenMatch.player2 && boardConfiguration.turn =="black")){
            //check turn. Player1 is always white and Player2 is always black
        
            //decrese token for move
            decreseTokenMove(playerOpenMatch.player1)

            //do the move
            boardConfiguration = jsChessEngine.move(boardConfiguration,req.body.moveFrom,req.body.moveTo)
            //move allowed
            let history = await modelMatches.getHistory(playerOpenMatch.matchid)
            let historyArray = []
            if(history != ""){
                historyArray = history.split(",")
            }
            historyArray.push(req.body.moveFrom + "->" + req.body.moveTo)
            var updateResult = await modelMatches.updateMatch(playerOpenMatch.matchid, JSON.stringify(boardConfiguration), historyArray.toString())
            if(!updateResult){
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
                    decreseTokenMove(playerOpenMatch.player1)
                    boardConfiguration = jsChessEngine.move(boardConfiguration,aiMoveFrom, aiMoveTo)
                    let history = await modelMatches.getHistory(playerOpenMatch.matchid)
                    let historyArray = []
                    if(history != ""){
                        historyArray = history.split(",")
                    }
                            historyArray.push(aiMoveFrom + "->" + aiMoveTo)
                            var updateResult = await modelMatches.updateMatch(playerOpenMatch.matchid, JSON.stringify(boardConfiguration), historyArray.toString())
                    }
                //update successfully
                result = successFactory.getSuccess(SuccessEnum.MoveSuccess).getResponse()
                result.data = {"nextTurn" : boardConfiguration.turn}
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
        match.dati = JSON.parse(match.dati)
        result = successFactory.getSuccess(SuccessEnum.StatusMatchSuccess).getResponse()
        result.data = match
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
        const history = await modelMatches.getHistory(matchId)
        result = successFactory.getSuccess(SuccessEnum.HistoryMovesSuccess).getResponse()
        result.data = {"history": history.split(",")}
    } catch(err){
        result = errorFactory.getError(ErrorEnum.StatusMatchError).getResponse()
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