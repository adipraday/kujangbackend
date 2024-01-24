import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const ActivityLog = db.define(
  "activitylog",
  {
    user_id: {
      type: DataTypes.INTEGER,
    },
    act_id: {
      type: DataTypes.STRING,
    },
    another_act_id: {
      type: DataTypes.STRING,
    },
    act_sub: {
      type: DataTypes.STRING,
    },
    act_desk: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

export default ActivityLog;
