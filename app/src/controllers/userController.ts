import * as modelUser from '../models/user'



export async function login(email:string, password:string, res:any){


    let [user] = JSON.parse(await modelUser.getUser(email))
    console.log("Controller All users:", JSON.stringify(user, null, 2));
    //console.log("user.password: ", user.password)
    console.log(user.password)
    console.log("user.password", user["password"])


    if(user.password == password){
        console.log("COINCIDONO")
    } else {
        console.log("NON COINCIDONO")
    }

    res.send(JSON.stringify(user))
    }

export function user(req:any, res:any){
    console.log("user")
}
