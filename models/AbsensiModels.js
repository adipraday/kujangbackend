import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Absensi = db.define(
  "absensi",
  {
    id_user: {
      type: DataTypes.INTEGER,
    },
    nama: {
      type: DataTypes.STRING,
    },
    tgl_absensi: {
      type: DataTypes.DATE,
    },
    keterangan: {
      type: DataTypes.STRING,
    },
    note: {
      type: DataTypes.TEXT,
    },
    doc: {
      type: DataTypes.TEXT,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Absensi;
