import { Sequelize } from "sequelize";

const db = new Sequelize(
  "kujang_db",
  "kujang_db",
  "Sk1n3t@2024@Sk1n3t",
  {
    host: "localhost",
    dialect: "mysql",
  }
);

export default db;
