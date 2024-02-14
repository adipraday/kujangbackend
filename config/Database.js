import { Sequelize } from "sequelize";

//### This access for vps production mode ###
// const db = new Sequelize(
//   "kujang_db",
//   "kujang_db",
//   "Sk1n3t@2024@Sk1n3t",
//   {
//     host: "localhost",
//     dialect: "mysql",
//   }
// );

//### This access for localhost development mode ###
const db = new Sequelize("kujang_db", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
