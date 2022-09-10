import {DbConnection} from "./DbConnection";
import {DataTypes, Sequelize} from 'sequelize';

//Connection to database
const sequelize: Sequelize = DbConnection.getConnection();

/**
 * Model 'User'
 * 
 * Define the model 'User' to interface with the "users" table 
 */
export const User = sequelize.define('users', {
    email: { type: DataTypes.STRING,  primaryKey: true },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING },
    token: {type: DataTypes.REAL}
},
{
    modelName: 'users',
    timestamps: false,
    //freezeTableName: true
});

export async function trovaTutto() {

 
    const users = await User.findAll({
        
    });
    console.log(users.every(user => user instanceof User)); // true
    console.log("All users:", JSON.stringify(users, null, 2));
 

}
export async function getUser(userEmail:string) {
    
    const users = await User.findAll({
        where:{
            email: userEmail
        }
    });

     return JSON.stringify(users);

}

export async function setToken(userEmail:string, token: number) {
    
    return await User.update({ token: token },{
    where:{
        email: userEmail
    }
    });    
}

export async function getToken(userEmail:string) {
  
    const utente  =  await User.findOne({
        attributes: ['token'],
        where:{
            email: userEmail
        }
    });

    return utente
      
}
