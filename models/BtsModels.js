import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Bts = db.define(
  "bts",
  {
    bts_label: {
      type: DataTypes.STRING,
    },
    bts_id: {
      type: DataTypes.STRING,
    },
    bts_area: {
      type: DataTypes.TEXT,
    },
    bts_input: {
      type: DataTypes.STRING,
    },
    bts_output_capacity: {
      type: DataTypes.INTEGER,
    },
    bts_output_used: {
      type: DataTypes.INTEGER,
    },
    bts_output_available: {
      type: DataTypes.INTEGER,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Bts;
