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

    start_date:{ type: DataTypes.DATEONLY},
    timestamp: {type: DataTypes.STRING},
    status: { type: DataTypes.STRING },
    winner: {type: DataTypes.STRING}

},
{
    modelName: 'matches',
    timestamps: false,
});

export async function insertNewMatch(Player1:string, Player2:string) {
    const Timestamp = Date.now()
    if(Player2 === "AI"){
        await Matches.create({
            player1: Player1,
            start_date:sequelize.fn('NOW'),
            timestamp: Timestamp,
            status:"open",
          });
    
    } else {
        await Matches.create({
            player1: Player1,
            player2: Player2,
            start_date:sequelize.fn('NOW'),
            timestamp: Timestamp,
            status : "open",
          });
    }

    return await Matches.findOne({
        raw: true,
        attributes: ['matchid'],
        where: {
            timestamp: Timestamp
          }        
    });
    
}


export async function getOpenMatchByUser(userEmail:string) {
    return await Matches.findOne({
        raw: true,
        where: {
                [Op.or]: [
                    { player1: userEmail},
                    { player2: userEmail}
                ],
                status: {
                [Op.ne]: "close"
                }
            
        }
        
        /*

SELECT * WHERE (`matches`.`player1` = 'users1@users1.it' OR `matches`.`player2` = 'users1@users1.it') AND `matches`.`status` != 'close' LIMIT 1;

        SELECT * FROM matches m WHERE ((m.player1 = userEmail || m.player2 = userEmail) AND m.status != 'close')
        
        where: {
            [Op.or]: [
                { player1: userEmail, status: 'open' },
                { player2: userEmail, status: 'open' }
            ]                
        } 
        */           
    });      
}

export async function getMatchesByUser(userEmail:string, userDateFrom:any, userDateTo:any) {
    var matches = []    
    matches = await Matches.findAll({
        where:{
            start_date: {
                [Op.between]: [userDateFrom, userDateTo]
            },
            [Op.or]: [
                { player1: userEmail},
                { player2: userEmail}
            ],
        }
    })
      
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

export async function getStats(inputOrder:string) {
    var stats = await sequelize.query("SELECT m.winner, COUNT(m.winner) AS Vittorie  FROM matches m WHERE m.winner IS NOT NULL GROUP BY m.winner ORDER BY Vittorie " + inputOrder, { type: QueryTypes.SELECT });
    return JSON.parse(JSON.stringify(stats))
}

export async function setState(inputMatchId:number, inputStatus:string) {
    
    return await Matches.update({ status: inputStatus },{
    where:{
        matchid: inputMatchId
    }
    });    
}


export async function getState(inputMatchId:number) {

    const result:any= await Matches.findOne({
        raw: true,
        attributes: ['status'],
        where:{
            matchid: inputMatchId
        }
    });   
    return result.status;
}


export async function setWinner(inputMatchId:number, inputPlayer:string) {
    
    return await Matches.update({ winner: inputPlayer },{
    where:{
        matchid: inputMatchId
    }
    });    
}