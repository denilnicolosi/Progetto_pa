import {Sequelize} from 'sequelize';


export class DbConnection {

    private static instance: DbConnection;

    private connection: Sequelize;

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


		this.connection = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
			host: process.env.DB_HOST,
			port: Number(process.env.DB_PORT),
			dialect: 'mysql'
		}); 

         
	}

    public static getConnection(): Sequelize {
        if (!DbConnection.instance) {
            DbConnection.instance = new DbConnection();
        }

        return DbConnection.instance.connection;
    }

} 