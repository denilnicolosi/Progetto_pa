import * as modelUser from '../models/user'



export function login(email:string, password:string, res:any){
    console.log(modelUser.trovaTutto())
    res.send(modelUser.trovaTutto())
    }

export function user(req:any, res:any){
    console.log("user")
}
