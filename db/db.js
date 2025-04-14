// db.js
import { Sequelize } from "sequelize";

const sequelize = new Sequelize("catalogue_db", "dashdev", "Admin01!", {
  host: "127.0.0.1",
  port: 3306,
  dialect: "mysql",
});

const dbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("? MySQL connection established successfully.");
  } catch (error) {
    console.error("? Unable to connect to the database:", error);
  }
};

export { sequelize, dbConnection };
