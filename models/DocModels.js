import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Docs = db.define(
  "activity_doc",
  {
    subject_id: {
      type: DataTypes.INTEGER,
    },
    subject: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    file: {
      type: DataTypes.TEXT,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Docs;
