import {DbConnection} from "./DbConnection";
import {DataTypes, Sequelize, Op, QueryTypes} from 'sequelize';
import { User } from "./userModel";



//Connection to database
const sequelize: Sequelize = DbConnection.getConnection();

/**
 * Model 'Matches'
 * 
 * Define the model 'Matches' to interface with the "matches" table 
 */
export const Matches = sequelize.define('matches', {
    matchid: { type: DataTypes.INTEGER,  primaryKey: true, autoIncrement: true },
    player1: { type: DataTypes.STRING, references: {
        model: User,
        key: 'email',
    } },
    player2: { type: DataTypes.STRING, references: {
        model: User,
        key: 'email',
    } },
    dati: { type: DataTypes.STRING },
    timestamp: {type: DataTypes.STRING},
    stato: { type: DataTypes.STRING },
    winner: {type: DataTypes.STRING}

},
{
    modelName: 'matches',
    timestamps: false,
});

export async function insertNewMatch(Player1:string, Player2:string, Dati:string) {
    const Timestamp = Date.now()
    console.log(typeof Dati)
    if(Player2 === "AI"){
        await Matches.create({
            player1: Player1,
            dati: Dati,
            timestamp: Timestamp,
            stato:"open",
          });
    
    } else {
        await Matches.create({
            player1: Player1,
            player2: Player2,
            dati: Dati,
            timestamp: Timestamp,
            stato : "open",
          });
    }

    const [match] = await Matches.findAll({
        attributes: ['matchid'],
        where: {
            timestamp: Timestamp
          }
        
    });
    return JSON.stringify(match) 
   }

   export async function getOpenMatchByUser(userEmail:string) {
    
    const OpenMatch = await sequelize.query("SELECT * FROM matches m WHERE (m.player1 = '" + userEmail + "' AND m.stato = 'open') OR (m.player2 = '" + userEmail + "' AND m.stato = 'open')", { type: QueryTypes.SELECT });
    /*
    const OpenMatch = await Matches.findAll({
        where:{
            [Op.or] : {
                [Op.and]:{
                    player1:userEmail,
                    stato:"open"
                },
                [Op.and]:{
                    player2:userEmail,
                    stato:"open"
                }
            }
        }
    });*/

     return JSON.stringify(OpenMatch);
}