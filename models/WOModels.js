import { TEXT } from "sequelize";
import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const WorkOrders = db.define('workorder',{
    no_wo:{
        type: DataTypes.STRING
    },
    nama_client:{
        type: DataTypes.STRING
    },
    id_pelanggan:{
        type: DataTypes.STRING
    },
    alamat:{
        type: DataTypes.TEXT
    },
    contact_person:{
        type: DataTypes.STRING
    },
    email:{
        type: DataTypes.STRING
    },
    tikor:{
        type: DataTypes.TEXT
    },
    link_tikor:{
        type: DataTypes.STRING
    },
    paket_berlangganan:{
        type: DataTypes.STRING
    },
    note:{
        type: DataTypes.TEXT
    },
    label_fat:{
        type: DataTypes.STRING
    },
    status:{
        type: DataTypes.STRING
    }
},{
    freezeTableName:true
});

export default WorkOrders;