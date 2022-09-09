import Jwt from 'jsonwebtoken'
import * as modelUser from '../models/userModel'
import {ErrorFactory} from '../factory/ErrorMessage'
import {SuccessFactory} from '../factory/SuccessMessage'
import {SuccessEnum, ErrorEnum, Message} from '../factory/Message'

const errorFactory: ErrorFactory = new ErrorFactory();
const successFactory: SuccessFactory = new SuccessFactory();

export async function login(email:string, password:string, res:any){
    var result:any = errorFactory.getError(ErrorEnum.DefaultError).getResponse()
    result.data = {}

    let [user] = JSON.parse(await modelUser.getUser(email))
    if(user.password == password){
        console.log("COINCIDONO")
        let payload = {
            email:user.email,
            role:user.role
        };
        let token = await Jwt.sign(payload, <string>process.env.SECRET_KEY)
        result = successFactory.getSuccess(SuccessEnum.LoginSuccess).getResponse()
        result.data = {"authorization" : token}
    } else {
        console.log("NON COINCIDONO")
        result = errorFactory.getError(ErrorEnum.LoginError).getResponse()
        result.data = {}
    }
    return result
}

export async function chargeToken(email:string, token:string, res:any){
   
    var result:any 
    try{   
        //controllo prima se esiste un utente con quella email        
        const [user] = JSON.parse(await modelUser.getUser(email))
        if(user !== undefined){
            //se esiste aggiorno l'importo dei token
            await modelUser.chargeToken(email, Number(token))               
            result = successFactory.getSuccess(SuccessEnum.TokenChargeSuccess).getResponse()
        }else{
            //altrimenti restituisco un errore
            result = errorFactory.getError(ErrorEnum.TokenChargeError).getResponse()
        }

    }catch(err : any){
        result = errorFactory.getError(ErrorEnum.TokenChargeError).getResponse()        
    }
    return result    
}


export function user(req:any, res:any){
    console.log("user")
}
