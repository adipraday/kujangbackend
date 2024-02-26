import express from "express";
import {
  getUsers,
  getWorkingStatus,
  getUserInfoById,
  Login,
  Register,
  Logout,
  updateUser,
  updateProfilePict,
  getAvailableTechnician,
  getTechnicianLeader,
} from "../controllers/Users.js";
import {
  getAbsensi,
  AddAbsensi,
  getAbsensiById,
  deleteAbsensiById,
} from "../controllers/Absensi.js";
import {
  getWorkOrders,
  getRiwayatWorkOrders,
  getWorkOrdersById,
  addWorkOrder,
  updateWorkOrder,
  updateProgressWo,
  deleteWorkOrderById,
  addTeknisiWo,
  getTeknisiWo,
  deleteTeknisiWo,
} from "../controllers/WorkOrders.js";
import {
  getFat,
  getAvailableFat,
  getFatById,
  addFat,
  updateFat,
  deleteFatById,
} from "../controllers/Fat.js";
import {
  getBts,
  getAvailableBts,
  getBtsById,
  addBts,
  updateBts,
  deleteBtsById,
} from "../controllers/Bts.js";
import {
  getDismantleList,
  getDismantleById,
  addDismantle,
  updateDismantle,
  addTeknisiWoDismantle,
  deleteTeknisiWoDismantle,
  getTeknisiWoD,
  reportDismantle,
  deleteDismantleById,
  getRiwayatWoDismantles,
} from "../controllers/Dismantle.js";
import {
  getMaintenance,
  getMaintenanceById,
  getMaintenanceActive,
  getMaintenanceHistory,
  addWoMaintenance,
  updateWoMaintenance,
  addTeknisiWoMaintenance,
  deleteTeknisiWoMaintenance,
  getTeknisiWoMaintenance,
  reportMaintenance,
  deleteMaintenanceById,
} from "../controllers/Maintenance.js";
import {
  uploadDoc,
  getDocs,
  getDocsById,
  getDocsBySubjectId,
  deleteDocById,
} from "../controllers/Doc.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { dashboardAct, getTimeLine } from "../controllers/ActivityLog.js";

const router = express.Router();

router.get("/users", getUsers);
router.put("/workingstatus", getWorkingStatus);
router.get("/getuserinfo/:id", getUserInfoById);
router.post("/register", Register);
router.post("/login", Login);
router.get("/token", refreshToken);
router.delete("/logout", Logout);
router.put("/updateuser", updateUser);
router.put("/updateprofilepict", updateProfilePict);
router.get("/getavailabletechnician", getAvailableTechnician);
router.get("/gettechnicianleader", getTechnicianLeader);
/////////////////////////////////////////////
router.get("/absensi", getAbsensi);
router.post("/addabsensi", AddAbsensi);
router.get("/absensiuser/:userId", getAbsensiById);
router.delete("/deleteabsensi/:id", deleteAbsensiById);
/////////////////////////////////////////////
router.get("/workorders", getWorkOrders);
router.get("/riwayatworkorder", getRiwayatWorkOrders);
router.get("/workorder/:id", getWorkOrdersById);
router.post("/addworkorder", addWorkOrder);
router.put("/updateworkorder", updateWorkOrder);
router.put("/updateprogresswo", updateProgressWo);
router.put("/deleteworkorder/:id/:userId", deleteWorkOrderById);
router.post("/addteknisiwo", addTeknisiWo);
router.get("/getteknisiwo/:id", getTeknisiWo);
router.delete("/deleteteknisiwo/:id/:teknisiId", deleteTeknisiWo);
/////////////////////////////////////////////
router.get("/dismantleworkorders", getDismantleList);
router.get("/riwayatwodismantle", getRiwayatWoDismantles);
router.get("/dismantleworkorder/:id", getDismantleById);
router.post("/addwodismantle", addDismantle);
router.put("/updatewodismantle", updateDismantle);
router.put("/updateprogresswod", reportDismantle);
router.put("/deletewodismantle/:id/:userId", deleteDismantleById);
router.post("/addteknisiwodismantle", addTeknisiWoDismantle);
router.get("/getteknisiwod/:id", getTeknisiWoD);
router.delete("/deleteteknisiwod/:id/:teknisiId", deleteTeknisiWoDismantle);
/////////////////////////////////////////////
router.get("/maintenancelist", getMaintenance);
router.get("/maintenancewobyid/:id", getMaintenanceById);
router.get("/maintenancewoactive", getMaintenanceActive);
router.get("/maintenancewohistory", getMaintenanceHistory);
router.post("/addwomaintenance", addWoMaintenance);
router.put("/updatewomaintenance", updateWoMaintenance);
router.post("/addteknisiwomaintenance", addTeknisiWoMaintenance);
router.delete("/deleteteknisiwom/:id/:teknisiId", deleteTeknisiWoMaintenance);
router.get("/getteknisiwom/:id", getTeknisiWoMaintenance);
router.put("/updateprogresswom", reportMaintenance);
router.put("/deletewomaintenance/:id/:userId", deleteMaintenanceById);
/////////////////////////////////////////////
router.get("/getdashboardact", dashboardAct);
router.post("/gettimeline", getTimeLine);
/////////////////////////////////////////////
router.get("/getfat", getFat);
router.get("/getavailablefat", getAvailableFat);
router.get("/getfat/:id", getFatById);
router.post("/addfat", addFat);
router.patch("/updatefat/:id", updateFat);
router.delete("/deletefat/:id", deleteFatById);
/////////////////////////////////////////////
router.get("/getbts", getBts);
router.get("/getavailablebts", getAvailableBts);
router.get("/getbts/:id", getBtsById);
router.post("/addbts", addBts);
router.patch("/updatebts/:id", updateBts);
router.delete("/deletebts/:id", deleteBtsById);
/////////////////////////////////////////////
router.post("/uploaddoc", uploadDoc);
router.get("/getdocs", getDocs);
router.get("/getdoc/:id", getDocsById);
router.get("/getdocbysubject/:id/:subject", getDocsBySubjectId);
router.delete("/deletedoc/:id", deleteDocById);
/////////////////////////////////////////////

export default router;
