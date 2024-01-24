import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Fat = db.define('fat',{
    fat_label:{
        type: DataTypes.STRING
    },
    fat_id:{
        type: DataTypes.STRING
    },
    fat_area:{
        type: DataTypes.TEXT
    },
    fat_input:{
        type: DataTypes.STRING
    },
    fat_output_capacity:{
        type: DataTypes.INTEGER
    },
    fat_output_used:{
        type: DataTypes.INTEGER
    },
    fat_output_available:{
        type: DataTypes.INTEGER
    }
},{
    freezeTableName:true
});

export default Fat;