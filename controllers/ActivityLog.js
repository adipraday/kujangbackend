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
