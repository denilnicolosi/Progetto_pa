import {Sequelize} from 'sequelize';

//singleton pattern implementation
export class DbConnection {
    //istance singleton DbConnectio
    private static instance: DbConnection;
    private connection: Sequelize;
    //default constructor
    private constructor() {
        if (
            !process.env.DB_NAME ||
            !process.env.DB_USER ||
            !process.env.DB_PASSWORD ||
            !process.env.DB_HOST ||
            !process.env.DB_PORT
          ) { 
            throw new Error("Environment variables are not set");
          }

        //istance Sequelize object as connectio
		this.connection = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
			host: process.env.DB_HOST,
			port: Number(process.env.DB_PORT),
			dialect: 'mysql'
		}); 

         
	}
    //getConnection method
    public static getConnection(): Sequelize {
        //if it is first initialization create DbConnection ogject
        if (!DbConnection.instance) {
            DbConnection.instance = new DbConnection();
        }
        //return object
        return DbConnection.instance.connection;
    }

} 