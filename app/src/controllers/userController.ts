import * as modelUser from '../models/userModel'



export async function login(email:string, password:string, res:any){

    let [user] = JSON.parse(await modelUser.getUser(email))

    if(user.password == password){
        console.log("COINCIDONO")
        res.send(JSON.stringify({"status":"OK"}))
    } else {
        console.log("NON COINCIDONO")
        res.send(JSON.stringify({"status":"Login failed"}))
    }

    }

export function user(req:any, res:any){
    console.log("user")
}
