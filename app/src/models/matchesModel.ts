import {DbConnection} from "./DbConnection";
import {DataTypes, Sequelize, Op, QueryTypes, where} from 'sequelize';
import { User } from "./userModel";
import { group } from "console";

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
   
    const stats = await Matches.findAll({
        raw: true,
        attributes: [
            'winner',
            [Sequelize.fn('COUNT', Sequelize.col('winner')), 'Vittorie']
        ],        
        where: {                
                [Op.not]:[{winner: null}],
                winner:{
                    [Op.and]:[
                        {[Op.ne]:'draw'},
                        {[Op.ne]:'AI'},
                    ]
                },
        },
        group: 'winner' ,
        order:[
            ['Vittorie', inputOrder],
        ]
    }) 
   
    return stats
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