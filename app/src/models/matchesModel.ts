import {DbConnection} from "./DbConnection";
import {DataTypes, Sequelize, Op, QueryTypes} from 'sequelize';
import { User } from "./userModel";
import { user } from "../controllers/userController";



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
    data_:{ type: DataTypes.DATEONLY},
    history: { type: DataTypes.STRING},
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
    if(Player2 === "AI"){
        await Matches.create({
            player1: Player1,
            dati: Dati,
            data_:sequelize.fn('NOW'),
            history: "",
            timestamp: Timestamp,
            stato:"open",
          });
    
    } else {
        await Matches.create({
            player1: Player1,
            player2: Player2,
            dati: Dati,
            data_:sequelize.fn('NOW'),
            history: "",
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

   export async function getHistory(matchId:number) {
    const result = await Matches.findOne({
        attributes: ['history'],
        where: {
            matchid: matchId
        }
    });
    return JSON.parse(JSON.stringify(result)).history
    }

    export async function getOpenMatchByUser(userEmail:string) {
        const OpenMatch = await sequelize.query("SELECT * FROM matches m WHERE (m.player1 = '" + userEmail + "' AND m.stato = 'open') OR (m.player2 = '" + userEmail + "' AND m.stato = 'open')", { type: QueryTypes.SELECT });
        return JSON.stringify(OpenMatch);
    }

    export async function updateMatch(Matchid:string, Dati:string, History:string) {
      
        return await Matches.update(
            { dati: Dati,
            history:History },
            { where: { matchid: Matchid } }
        )
                
    }
    export async function getMatchesByUser(userEmail:string, userDateFrom:any, userDateTo:any) {
        var matches = []
        if(userDateFrom && userDateTo){
            matches = await sequelize.query("SELECT * FROM matches m WHERE m.data_ BETWEEN '" + userDateFrom + "' AND '" + userDateTo + "'", { type: QueryTypes.SELECT });
        } else {
            matches = await Matches.findAll({
                where: {
                    player1: userEmail,
                  }
                
            });    
        }
        return JSON.stringify(matches)
    }

    export async function getMatchesById(userMatchId:number) {
        const [match] = await Matches.findAll({
            where: {
                matchid: userMatchId
              }
            
        });
        return JSON.stringify(match)  
    }

    export async function getStats() {
        var stats = await sequelize.query("SELECT m.winner, COUNT(m.winner) AS Vittorie  FROM matches m WHERE m.winner IS NOT NULL GROUP BY m.winner ", { type: QueryTypes.SELECT });
        return JSON.parse(JSON.stringify(stats))
    }