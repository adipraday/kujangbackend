import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Maintenance = db.define(
  "maintenance",
  {
    no_wo: {
      type: DataTypes.STRING,
    },
    jenis_maintenance: {
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
    status: {
      type: DataTypes.STRING,
    },
    first_note: {
      type: DataTypes.TEXT,
    },
    last_note: {
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

export default Maintenance;
