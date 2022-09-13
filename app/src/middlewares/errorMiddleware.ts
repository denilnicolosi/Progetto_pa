import {ErrorFactory} from '../factory/ErrorMessage'
import {ErrorEnum, Message} from '../factory/Message'

const errorFactory: ErrorFactory = new ErrorFactory();

export function errorRouteNotFound(req: any, res: any, next: any) {
    next(ErrorEnum.RouteNotFound)
}

export function errorHandler(err: ErrorEnum, req: any, res: any, next: any) {
    var response = errorFactory.getMessage(err).getResponse()
    console.log("ERROR HANDLER:"+ response.message)
    res.status(response.status).send(JSON.stringify({"response" : response.message, "data" : {}}))
}