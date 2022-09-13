import Jwt from 'jsonwebtoken'
import * as modelUser from '../models/userModel'
import {ErrorFactory} from '../factory/ErrorMessage'
import {SuccessFactory} from '../factory/SuccessMessage'
import {SuccessEnum, ErrorEnum, Message} from '../factory/Message'

const errorFactory: ErrorFactory = new ErrorFactory();
const successFactory: SuccessFactory = new SuccessFactory();

export async function login(email:string, password:string, res:any){
    var result:any 
    
    try{

        let user:any = await modelUser.getUser(email)
        if(user!=null && user.password == password){
            console.log("Login effettuato")
            let payload = {
                email:user.email,
                role:user.role
            };
            let token = await Jwt.sign(payload, <string>process.env.SECRET_KEY)
            result = successFactory.getMessage(SuccessEnum.LoginSuccess).getResponse()
            result.data = {"authorization" : token}
        } else {
            console.log("Login fallito")
            result = errorFactory.getMessage(ErrorEnum.LoginError).getResponse()
            result.data = {}
        }
    }catch(err){
        result = errorFactory.getMessage(ErrorEnum.LoginError).getResponse()
    }
    return result
}

export async function chargeToken(email:string, token:string, res:any){
   
    var result:any 
    try{   
        //controllo prima se esiste un utente con quella email        
        const user:any = await modelUser.getUser(email)
        if(user != null){
            //se esiste aggiorno l'importo dei token
            await modelUser.setToken(email, Number(token))               
            result = successFactory.getMessage(SuccessEnum.TokenChargeSuccess).getResponse()
        }else{
            //altrimenti restituisco un errore
            result = errorFactory.getMessage(ErrorEnum.TokenChargeError).getResponse()
        }

    }catch(err : any){
        result = errorFactory.getMessage(ErrorEnum.TokenChargeError).getResponse()        
    }
    return result    
}

export async function getToken(req:any) {
    var result:any
    try{
        const decoded:any = <string>Jwt.decode(req.headers.authorization)
        const token = await modelUser.getToken(decoded.email)      
                     
        if(token != null){            
            result= successFactory.getMessage(SuccessEnum.TokenGetSuccess).getResponse()
            result.data=token
        }else{
            result = errorFactory.getMessage(ErrorEnum.TokenGetBadRequest).getResponse() 
        }        
    }catch(err)
    {
        result = errorFactory.getMessage(ErrorEnum.TokenGetError).getResponse() 
    }
    return result
}


