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
    var result:any = errorFactory.getError(ErrorEnum.DefaultError).getResponse()
    result.data= {}
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

    console.log(result)
    return result
}


/*
game.printToConsole()
game.move("A2","A3")
game.printToConsole()
game.move("A7","A6")
game.printToConsole()
console.log()
console.log("--------- HISTORY ------------")
console.log(game.getHistory())*/

