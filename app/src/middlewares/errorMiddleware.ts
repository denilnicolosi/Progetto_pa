import {ErrorFactory} from '../factory/ErrorMessage'
import {ErrorEnum, Message} from '../factory/Message'
//error factory istances
const errorFactory: ErrorFactory = new ErrorFactory();
//in case user request non existing route
export function errorRouteNotFound(req: any, res: any, next: any) {
    next(ErrorEnum.RouteNotFound)
}

//error handler from the middleware
export function errorHandler(err: ErrorEnum, req: any, res: any, next: any) {
    var response = errorFactory.getMessage(err).getResponse()
    console.log("MIDDLEWARE ERROR HANDLER: "+ response.message)
    res.setHeader('Content-Type', response.type).status(response.status).send(JSON.stringify({"response" : response.message, "data" : {}}))
}