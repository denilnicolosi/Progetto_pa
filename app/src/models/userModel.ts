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
},
{
    modelName: 'users',
    timestamps: false,
    //freezeTableName: true
});

export async function trovaTutto() {
    // return DbConnection.getConnection();
 
    const users = await User.findAll({
        
    });
    console.log(users.every(user => user instanceof User)); // true
    console.log("All users:", JSON.stringify(users, null, 2));
 
     //return await User.findAll();
   }
export async function getUser(userEmail:string) {
    
    console.log("Model: " + userEmail)
    const users = await User.findAll({
        where:{
            email: userEmail
        }
    });
    //console.log(users.every(user => user instanceof User)); // true 
    console.log("Model All users:", JSON.stringify(users, null, 2));

     return JSON.stringify(users);
   }