import Jwt from 'jsonwebtoken'
import * as modelUser from '../models/userModel'


export async function login(email:string, password:string, res:any){
    let [user] = JSON.parse(await modelUser.getUser(email))

    if(user.password == password){
        console.log("COINCIDONO")

        let payload = {
            email:user.email,
            role:user.role
        };
        let token = await Jwt.sign(payload, <string>process.env.SECRET_KEY)
        res.send(JSON.stringify({"status":"OK", "token":token}))
    } else {
        console.log("NON COINCIDONO")
        res.send(JSON.stringify({"status":"Login failed"}))
    }

    }

export function user(req:any, res:any){
    console.log("user")
}
