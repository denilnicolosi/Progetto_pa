import Jwt from 'jsonwebtoken'
import * as modelUser from '../models/userModel'
import {ErrorFactory} from '../factory/ErrorMessage'
import {SuccessFactory} from '../factory/SuccessMessage'
import {SuccessEnum, ErrorEnum, Message} from '../factory/Message'

const errorFactory: ErrorFactory = new ErrorFactory();
const successFactory: SuccessFactory = new SuccessFactory();

export async function login(email:string, password:string, res:any) : Promise<Message>{
    let [user] = JSON.parse(await modelUser.getUser(email))

    if(user.password == password){
        console.log("COINCIDONO")

        let payload = {
            email:user.email,
            role:user.role
        };
        let token = await Jwt.sign(payload, <string>process.env.SECRET_KEY)
        //return JSON.stringify({"status":"OK", "token":token})
        return successFactory.getSuccess(SuccessEnum.LoginSuccess)
    } else {
        console.log("NON COINCIDONO")
        //return JSON.stringify({"status":"Login failed"})
        return errorFactory.getError(ErrorEnum.DefaultError)
    }

    }

export function user(req:any, res:any){
    console.log("user")
}
