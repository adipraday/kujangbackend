import { TEXT } from "sequelize";
import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Dismantle = db.define(
  "dismantle",
  {
    no_wo: {
      type: DataTypes.STRING,
    },
    nama_client: {
      type: DataTypes.STRING,
    },
    id_pelanggan: {
      type: DataTypes.STRING,
    },
    alamat: {
      type: DataTypes.TEXT,
    },
    contact_person: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    input_fat: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
    client_note: {
      type: DataTypes.TEXT,
    },
    teknisi_note: {
      type: DataTypes.TEXT,
    },
    perangkat_note: {
      type: DataTypes.TEXT,
    },
    image_doc_perangkat: {
      type: DataTypes.TEXT,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Dismantle;
