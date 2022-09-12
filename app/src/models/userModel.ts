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


export async function getUser(userEmail:string) {
    
    return await User.findOne({
        raw:true,
        where:{
            email: userEmail
        }
    });    

}

export async function setToken(userEmail:string, token: number) {
    
    return await User.update({ token: token },{
    where:{
        email: userEmail
    }
    });    
}

export async function getToken(userEmail:string) {
  
    return await User.findOne({
        raw: true,
        attributes: ['token'],
        where:{
            email: userEmail
        }
    });   
      
}
