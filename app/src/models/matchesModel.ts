import {DbConnection} from "./DbConnection";
import {DataTypes, Sequelize} from 'sequelize';
import { User } from "./userModel";



//Connection to database
const sequelize: Sequelize = DbConnection.getConnection();

/**
 * Model 'Matches'
 * 
 * Define the model 'Matches' to interface with the "matches" table 
 */
export const Matches = sequelize.define('matches', {
    matchid: { type: DataTypes.INTEGER,  primaryKey: true },
    player1: { type: DataTypes.STRING, references: {
        model: User,
        key: 'email',
    } },
    player2: { type: DataTypes.STRING, references: {
        model: User,
        key: 'email',
    } },
    JSON: { type: DataTypes.STRING },
},
{
    modelName: 'matches',
    timestamps: false,
});

export async function trovaTutto() {
 
    const matches = await Matches.findAll({
        
    });
    console.log(matches.every(matches => matches instanceof Matches)); // true
    console.log("All matches:", JSON.stringify(matches, null, 2));
 
   }
