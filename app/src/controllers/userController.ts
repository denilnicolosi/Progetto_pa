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
    }catch(err){
        result = errorFactory.getError(ErrorEnum.LoginError).getResponse()
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
            await modelUser.setToken(email, Number(token))               
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

export async function getToken(req:any) {
    var result:any
    try{
        const decoded:any = <string>Jwt.decode(req.headers.authorization)
        const token = await modelUser.getToken(decoded.email)
        console.log(token)
              
        if(token !== undefined){            
            result= successFactory.getSuccess(SuccessEnum.TokenGetSuccess).getResponse()
            result.data=token
        }else{
            result = errorFactory.getError(ErrorEnum.TokenGetBadRequest).getResponse() 
        }        
    }catch(err)
    {
        result = errorFactory.getError(ErrorEnum.TokenGetError).getResponse() 
    }
    return result
}


