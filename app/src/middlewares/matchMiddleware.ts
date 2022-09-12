import Jwt, { JsonWebTokenError } from 'jsonwebtoken'
import {ErrorFactory} from '../factory/ErrorMessage'
import {ErrorEnum, Message} from '../factory/Message'

const errorFactory: ErrorFactory = new ErrorFactory();


/**
 * Check if the input body contains valid email
 * @param req user request
 * @param res response
 * @param next next middleware
 */

 export const checkChallenger = function (req: any, res: any, next: any) {
  try {
    //checking if email is valid
    if (typeof req.body.vs !== "string"){
      next(ErrorEnum.EmailNotValidAddress)
    } else {
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if(req.body.vs == "AI" || pattern.test(req.body.vs)){
          next();
        } else {
          next(ErrorEnum.EmailNotValidAddress)        
        }
      }
  } catch (error: any) {
    next(ErrorEnum.CreateMatchError)    
  }
};

export const checkAILevel = function (req: any, res: any, next: any) {
  try {
    console.log("mossa di livello " + req.body.level)
    if(req.body.level >= 0 && req.body.level <=4){
      console.log("OK")
      next()
    } else {
      console.log("NO")
      next(ErrorEnum.CreateMatchBadRequest)
    }
  } catch (error: any) {
    next(ErrorEnum.CreateMatchError)    
  }
};

export const checkDate = function (req:any, res:any, next:any){
  const from = new Date(req.body.dateFrom)
  const to = new Date(req.body.dateTo)

  if(!req.body.dateFrom || !req.body.dateFrom || !(from <= to)){
    next(ErrorEnum.PlayedMatchBadRequest)
  }else{
    next()
  }
}
export const checkMoves = function (req: any, res: any, next:any){
  try{
    var pattern = new RegExp("([A-H|a-h][1-8])");

    if(pattern.test(req.body.moveFrom) && pattern.test(req.body.moveTo)){
      next()
    } else {
      next(ErrorEnum.MoveBadRequest)
    }
  }catch(err){
    next(ErrorEnum.MoveBadRequest)
  }

};

export const checkMatchId = function (req:any, res:any, next:any){
  const matchId = req.body.matchId
  if((typeof matchId) === "number" && matchId > 0){
    next()
  } else {
    next(ErrorEnum.StatusMatchBadRequest)
  }
}

export const checkExportType = function(req:any, res:any, next:any){
  try{
    if(req.body.type=="FEN" || req.body.type=="JSON"){
      next()
    }else{
      next(ErrorEnum.HistoryMovesBadRequest)
    }
  }catch(err){
    next(ErrorEnum.HistoryMovesError)
  }
}

