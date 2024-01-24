import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Users = db.define('users',{
    username:{
        type: DataTypes.STRING
    },
    name:{
        type: DataTypes.STRING
    },
    jobdesk:{
        type: DataTypes.STRING
    },
    aktif_sejak:{
        type: DataTypes.DATE
    },
    whatsapp:{
        type: DataTypes.STRING
    },
    telp:{
        type: DataTypes.STRING
    },
    email:{
        type: DataTypes.STRING
    },
    status:{
        type: DataTypes.STRING
    },
    password:{
        type: DataTypes.STRING
    },
    refresh_token:{
        type: DataTypes.TEXT
    }
},{
    freezeTableName:true
});

export default Users;