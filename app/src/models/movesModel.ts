import {DbConnection} from "./DbConnection";
import {DataTypes, Sequelize, Op, QueryTypes} from 'sequelize';
import { User } from "./userModel";
import { Matches } from "./matchesModel";

//Connection to database
const sequelize: Sequelize = DbConnection.getConnection();

/**
 * Model 'Moves'
 * 
 * Define the model 'Matches' to interface with the "matches" table 
 */
export const Moves = sequelize.define('moves', {
    moveid: { type: DataTypes.INTEGER,  primaryKey: true, autoIncrement: true },
    matchid: { type: DataTypes.INTEGER, references: {
        model: Matches,
        key: 'matchid',
    } },
    from:{ type: DataTypes.STRING},
    to: { type: DataTypes.STRING},
    boardConfiguration: {type: DataTypes.TEXT}},
{
    modelName: 'moves',
    timestamps: false
});


export async function insertMove(new_matchId:number, new_from:any, new_to:any, new_boardConfiguration:string) {
    return await Moves.create({
        matchid: new_matchId,
        from: new_from,
        to:new_to,
        boardConfiguration: new_boardConfiguration
      });
}

export async function getLastBoardConfiguration(input_matchId:number) {
    const result:any = await Moves.findOne({
        raw: true,
        attributes: ['boardConfiguration'],
        where: {
            matchid: input_matchId               
        },  
        order: [
            ["moveid", "DESC"]
        ]         
    });      
    return JSON.parse(result.boardConfiguration)
}


export async function getHistoryFromMatch(input_matchId:number) {
    return await Moves.findAll({
        raw: true,
        where: {
            matchid: input_matchId               
        },  
        order: [
            ["moveid", "ASC"]
        ]          
    });      
}

export async function getMovesCountByMatch(input_matchId:number){
    
    const result:any= await Moves.findOne({
        raw: true,
        attributes: [
            [Sequelize.fn('COUNT', Sequelize.col('*')), 'conteggio']
        ],   
        where: {
            matchid: input_matchId               
        }, 
        group: 'matchid' ,
    })

    return result.conteggio-1
}