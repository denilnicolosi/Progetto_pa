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
      var response = errorFactory.getError(ErrorEnum.DefaultError).getResponse()
      res.status(response.status).send(response.message)
  } else {
      var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
      if(req.body.vs == "AI" || pattern.test(req.body.vs)){
        next();
      } else {
        var response = errorFactory.getError(ErrorEnum.EmailNotValidAddress).getResponse()
        res.status(response.status).send(response.message)
    }
    }
  } catch (error: any) {
    var response = errorFactory.getError(ErrorEnum.DefaultError).getResponse()
    res.status(response.status).send(response.message)
}
};