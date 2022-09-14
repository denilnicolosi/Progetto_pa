import Jwt, { JsonWebTokenError } from 'jsonwebtoken'
import {ErrorFactory} from '../factory/ErrorMessage'
import {ErrorEnum, Message} from '../factory/Message'

const errorFactory: ErrorFactory = new ErrorFactory();


//check "vs" param in new game route
export const checkChallenger = function (req: any, res: any, next: any) {
  try {
    //checking if email is valid
    if (typeof req.body.vs !== "string"){
      next(ErrorEnum.EmailNotValidAddress)
    } else {
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        //the field can be "AI" to play with AI, else we check with pattern the email
        if(req.body.vs == "AI" || pattern.test(req.body.vs)){
          next();
        } else {
          next(ErrorEnum.EmailNotValidAddress)        
        }
      }
  } catch (error: any) {
    next(ErrorEnum.EmailNotValidAddress)    
  }
};

//check "dateFrom" and "dateTo" param in playedmatch route
export const checkDate = function (req:any, res:any, next:any){
  try{
    //if the date format is not valid, the constructor of Date returns an exception
    const from = new Date(req.body.dateFrom)
    const to = new Date(req.body.dateTo)

    //also check that the start date is not higher than the end date
    if(!req.body.dateFrom || !req.body.dateFrom || !(from <= to)){
      next(ErrorEnum.PlayedMatchBadRequest)
    }else{
      next()
    }
  }catch(err){
    next(ErrorEnum.PlayedMatchBadRequest)
  }
}

//check "moveTo" and "moveFrom" param in move route
export const checkMoves = function (req: any, res: any, next:any){
  try{
    var pattern = new RegExp("([A-H|a-h][1-8])"); //pattern to validate the move syntax

    if(pattern.test(req.body.moveFrom) && pattern.test(req.body.moveTo)){
      next()
    } else {
      next(ErrorEnum.MoveBadRequest)
    }
  }catch(err){
    next(ErrorEnum.MoveBadRequest)
  }

};

//check "matchId" param 
export const checkMatchId = function (req:any, res:any, next:any){
  try{
    const matchId = req.body.matchId
    //it must be a number and >0
    if((typeof matchId) === "number" && matchId > 0){
      next()
    } else {
      next(ErrorEnum.MatchIdBadRequest)
    }
  }catch(err){
    next(ErrorEnum.MatchIdBadRequest)
  }
}

//check "type" param in history moves route
export const checkExportType = function(req:any, res:any, next:any){
  try{
    //it must be only "FEN" or "JSON"
    if(req.body.type=="FEN" || req.body.type=="JSON"){
      next()
    }else{
      next(ErrorEnum.HistoryMovesBadRequest)
    }
  }catch(err){
    next(ErrorEnum.HistoryMovesBadRequest)
  }
}

//check "order" param in players rank route
export const checkOrder = function(req:any, res:any, next:any){
  try{
    //it must be only "desc" or "asc", and we rewrite it in uppercase to use it in controller
    if(req.body.order=="desc"){
      req.body.order=="DESC"
      next()
    }else if (req.body.order=="asc"){
      req.body.order=="ASC"
      next()
    }else{
      next(ErrorEnum.PlayerRankBadRequest)
    }
  }catch(err){
    next(ErrorEnum.PlayerRankBadRequest)
  }
}
