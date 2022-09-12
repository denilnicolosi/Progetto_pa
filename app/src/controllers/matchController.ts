import Jwt from 'jsonwebtoken'
import * as modelUser from '../models/userModel'
import * as modelMatches from '../models/matchesModel'
import {ErrorFactory} from '../factory/ErrorMessage'
import {SuccessFactory} from '../factory/SuccessMessage'
import {ErrorEnum, Message, SuccessEnum} from '../factory/Message'

const errorFactory: ErrorFactory = new ErrorFactory();
const successFactory: SuccessFactory = new SuccessFactory();
const jsChessEngine = require('js-chess-engine')

function xor(a: any, b: any) {
    return !!a !== !!b;
}

export async function newMatch(req:any, res:any){
    var result:any 
    var player = JSON.parse(JSON.stringify(Jwt.verify(req.headers.authorization, <string>process.env.SECRET_KEY))).email
    let challenger = req.body.vs
    //check if player has no match open
    const playerOpenMatch = JSON.parse(await modelMatches.getOpenMatchByUser(player))
    if(playerOpenMatch.length == 0){
        //player has no opened match, check if challenger is AI
        if(challenger === "AI"){
            //challenger is AI open a new game with it
            console.log("Player plays vs AI")
            console.log(player + " vs " + challenger)
            const game = new jsChessEngine.Game()
            const stato = JSON.stringify(game.exportJson())
            const matchid = JSON.parse(await modelMatches.insertNewMatch(player, "AI", stato)).matchid
            console.log("Creata partita: " + matchid)
            result = successFactory.getSuccess(SuccessEnum.CreateMatchSuccess).getResponse()
            result.data = { "matchid" : matchid}
        } else {
            //challenger isn't AI, check on DB if challenger is one of the registred user
            let [user] = JSON.parse(await modelUser.getUser(challenger))
            if(!user || player == challenger){
                //challenger is'nt one of the registred user so return error
                console.log("Challenger not found or player are tring to play with himself")
                result = errorFactory.getError(ErrorEnum.EmailNotValidAddress).getResponse()
                result.data = {}
            } else {
                //challenger is one of the register user, check if him has opened match
                const challengerOpenMatch = JSON.parse(await modelMatches.getOpenMatchByUser(challenger))
                if(challengerOpenMatch.length == 0){
                    //challenger hasnt opened match, let's create a new match
                    console.log("Player and Challenger has'nt opened match")
                    console.log(player + " vs " + challenger)
                    const game = new jsChessEngine.Game()
                    const stato = JSON.stringify(game.exportJson())
                    const matchid = JSON.parse(await modelMatches.insertNewMatch(player, challenger, stato)).matchid
                    console.log("Creata partita: " + matchid)
                    result = successFactory.getSuccess(SuccessEnum.CreateMatchSuccess).getResponse()
                    result.data = { "matchid" : matchid}    
                } else {
                    //challenger has opened match, let's return a error
                    console.log("Challenger has opened match")
                    result = errorFactory.getError(ErrorEnum.CreateMatchNotAllowed).getResponse()
                    result.data = {}
                }
            }
        }    
    } else {
        //player has opened match, return a error
        console.log("Player has opened match")
        result = errorFactory.getError(ErrorEnum.CreateMatchNotAllowed).getResponse()
        result.data = {}
    }
    return result
}

export async function move(req:any, res:any){
    var result:any
    
    //get user email from jwt
    const decoded:any = <string>Jwt.decode(req.headers.authorization)
    var player = decoded.email

    const [playerOpenMatch] = JSON.parse(await modelMatches.getOpenMatchByUser(player))
    console.log(playerOpenMatch)
    var boardConfiguration = JSON.parse(playerOpenMatch.dati)

    if((player == playerOpenMatch.player1 && boardConfiguration.turn =="white") || (player == playerOpenMatch.player2 && boardConfiguration.turn =="black")){
        //check turn. Player1 is always white and Player2 is alwais black
        try{
            boardConfiguration = jsChessEngine.move(boardConfiguration,req.body.moveFrom,req.body.moveTo)
            //move allowed
            var updateResult = await modelMatches.updateMatch(playerOpenMatch.matchid, JSON.stringify(boardConfiguration))
            if(!updateResult){
                //failed to update database
                result = errorFactory.getError(ErrorEnum.MoveError).getResponse()
                result.data = {}
            } else {
                if(playerOpenMatch.player2 === null){
                    var aiMove = jsChessEngine.aiMove(boardConfiguration, req.body.level)
                    const from = Object.keys(aiMove)[0]
                    const to = Object.values(aiMove)[0]
                    boardConfiguration = jsChessEngine.move(boardConfiguration,from, to)
                    var updateResult = await modelMatches.updateMatch(playerOpenMatch.matchid, JSON.stringify(boardConfiguration))
                }
                    //update successfully
                    result = successFactory.getSuccess(SuccessEnum.MoveSuccess).getResponse()
                    result.data = {"nextTurn" : boardConfiguration.turn}
                }
        } catch(e:any){
            //move not allowed, return error
            result = errorFactory.getError(ErrorEnum.MoveNotAllowedError).getResponse()
            result.data = {"message" : e.message}        
        }
        
    } else {
        //move not allowed, return error
        result = errorFactory.getError(ErrorEnum.MoveNotAllowedError).getResponse()
        result.data = {}        
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
        const match = await modelMatches.getMatchesById(matchId)
        result = successFactory.getSuccess(SuccessEnum.StatusMatchSuccess).getResponse()
        result.data = match
    } catch(err){
        result = errorFactory.getError(ErrorEnum.StatusMatchError).getResponse()
        result.data = {}
    }
    return result
}
