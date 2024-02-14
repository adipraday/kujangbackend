import ActivityLog from "../models/ActivityLogModels.js";
import { Op } from "sequelize";

export const dashboardAct = async (req, res) => {
  try {
    const logAct = await ActivityLog.findAll({
      where: {
        // Use the Op.in operator for a single condition with multiple values
        act_sub: {
          [Op.in]: [
            "Teknisi Ditambahkan",
            "Teknisi Dibatalkan",
            "Progress WorkOrder Diperbaharui",
            "Data WorkOrder Diperbaharui",
            "WorkOrder Diterbitkan",
            "WO Dismantle Diterbitkan",
            "WO Dismantle Updated",
            "Progress WO Dismantle Diperbaharui",
            "WO Maintenance Diterbitkan",
            "WO Maintenance Updated",
            "Progress WO Maintenance Diperbaharui",
          ],
        },
      },
      order: [["id", "DESC"]],
      limit: 50,
    });
    res.json(logAct);
  } catch (error) {
    console.log(error);
    res.json({ msg: "Data activity gagal ditampilkan" });
  }
};

export const getTimeLine = async (req, res) => {
  const kd_act = req.body.kd_act;
  try {
    const timelinewo = await ActivityLog.findAll({
      where: {
        act_desk: {
          [Op.like]: `%${kd_act}%`,
        },
      },
      order: [["id", "ASC"]],
    });
    res.json(timelinewo);
  } catch (error) {
    console.log(error);
    res.json({ msg: "Timeline gagal ditampilkan" });
  }
};
