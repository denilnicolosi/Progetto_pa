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
        //retrieve user information from DB
        let user:any = await modelUser.getUser(email)
        //if user is found in the DB  and the password is correct do login and generate the JWT token
        if(user!=null && user.password == password){
            console.log("Login effettuato")
            //compose payload with the user info
            let payload = {
                email:user.email,
                role:user.role
            };
            //sign the JWT
            let token = await Jwt.sign(payload, <string>process.env.SECRET_KEY)
            //compose response
            result = successFactory.getMessage(SuccessEnum.LoginSuccess).getResponse()
            result.data = {"authorization" : token}
        } else {
            //compose error in case that login failed
            console.log("Login fallito")
            result = errorFactory.getMessage(ErrorEnum.LoginError).getResponse()           
        }
    }catch(err){
        //compose error in case of internar error
        result = errorFactory.getMessage(ErrorEnum.LoginError).getResponse()
    }
    return result
}

export async function chargeToken(email:string, token:string, res:any){
   //charge user token by admin
    var result:any 
    try{   
        //first check if there is a user with that email       
        const user:any = await modelUser.getUser(email)
        if(user != null){
            //if exists update the amount of tokens
            await modelUser.setToken(email, Number(token))  
            //compose success             
            result = successFactory.getMessage(SuccessEnum.TokenChargeSuccess).getResponse()
        }else{
            //else compose error
            result = errorFactory.getMessage(ErrorEnum.TokenChargeError).getResponse()
        }

    }catch(err : any){
        //compose error
        result = errorFactory.getMessage(ErrorEnum.TokenChargeError).getResponse()        
    }
    return result    
}

export async function getToken(req:any) {
    //get token amount
    var result:any
    try{
        //get user information from JWT
        const decoded:any = <string>Jwt.decode(req.headers.authorization)
        //get user token amount from DB
        const token = await modelUser.getToken(decoded.email)      
        
        if(token != null){         
            //if the operation is successful compose result with token amount   
            result= successFactory.getMessage(SuccessEnum.TokenGetSuccess).getResponse()
            result.data=token
        }else{
            //else compose error
            result = errorFactory.getMessage(ErrorEnum.TokenGetError).getResponse() 
        }        
    }catch(err){
        //compose error
        result = errorFactory.getMessage(ErrorEnum.TokenGetError).getResponse() 
    }
    return result
}


