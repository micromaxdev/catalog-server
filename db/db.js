// db.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
  }
);

const dbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log(
      `? MySQL connection established successfully in ${process.env.NODE_ENV} environment.`
    );
  } catch (error) {
    console.error("? Unable to connect to the database:", error);
  }
};

export { sequelize, dbConnection };
