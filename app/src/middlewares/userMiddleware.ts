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
 export const checkInputEmail = function (req: any, res: any, next: any) {
    try {
      //checking if email is valid
      if (
        typeof req.body.email !== "string"     
      ) {
        var response = errorFactory.getError(ErrorEnum.DefaultError).getResponse()
        res.status(response.status).send(response.message)
      } else {
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!pattern.test(req.body.email)) {
          var response = errorFactory.getError(ErrorEnum.EmailNotValidAddress).getResponse()
          res.status(response.status).send(response.message)
          } else {
          next();
        }
      }
    } catch (error: any) {
      var response = errorFactory.getError(ErrorEnum.DefaultError).getResponse()
      res.status(response.status).send(response.message)
    }
  };

 export const checkInputPassword = function (req: any, res: any, next: any) {
    try {
      //checking if password is valid
      if (
        typeof req.body.password !== "string" ||
        req.body.password.length > 50
      ) {
        var error = "errore"
        next(error);
      } else next();
    } catch (error: any) {
      var error= "errore"
      next(error);
    }
  };

  export const checkJWT = function (req: any, res: any, next: any) {
    try {
      //checking if password is valid
      if(req.headers.authorization){
        const decoded = <string>Jwt.verify(req.headers.authorization, <string>process.env.SECRET_KEY)
      }
      else
      {
        var response = errorFactory.getError(ErrorEnum.DefaultError).getResponse()
        res.status(response.status).send(response.message)
      }

      

      next();
    } catch (error:any) {
      var error= "errore JWT"
      next(error);
    }
  };