import Maintenance from "../models/MaintenanceModels.js";
import ActivityLog from "../models/ActivityLogModels.js";
import Users from "../models/UserModel.js";
const apiWaUrl =
  "https://api.360messenger.net/sendMessage/FlHHLUSjjcAWgramCMz9Mkvb4UHljWqf1sg";
import { Op } from "sequelize";

///////////////////////////////////////////////////////////////////////////////////////////
// Get list Dismantle Data ////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

export const getMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findAll({
      attributes: [
        "id",
        "no_wo",
        "jenis_maintenance",
        "nama_client",
        "id_pelanggan",
        "alamat",
        "contact_person",
        "email",
        "status",
        "first_note",
        "last_note",
        "createdAt",
        "updatedAt",
      ],
      order: [["id", "DESC"]],
      limit: 100,
    });
    if (!maintenance[0]) return res.json({ msg: "Belum ada data record" });
    res.json(maintenance);
  } catch (error) {
    console.log(error);
  }
};

///////////////////////////////////////////////////////////////////////////////////////////
// Get Dismantle Data by id ///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

export const getMaintenanceById = async (req, res) => {
  try {
    const maintenance = await Maintenance.findAll({
      attributes: [
        "id",
        "no_wo",
        "jenis_maintenance",
        "nama_client",
        "id_pelanggan",
        "alamat",
        "contact_person",
        "email",
        "status",
        "first_note",
        "last_note",
        "createdAt",
        "updatedAt",
      ],
      where: {
        id: req.params.id,
      },
    });
    if (!maintenance[0]) return res.json({ msg: "Data tidak ditemukan" });
    res.json(maintenance);
  } catch (error) {
    console.log(error);
  }
};

///////////////////////////////////////////////////////////////////////////////////////////
// Get list Dismantle Data (Active) ///////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

export const getMaintenanceActive = async (req, res) => {
  try {
    const maintenance = await Maintenance.findAll({
      attributes: [
        "id",
        "no_wo",
        "jenis_maintenance",
        "nama_client",
        "id_pelanggan",
        "alamat",
        "contact_person",
        "email",
        "status",
        "first_note",
        "last_note",
        "createdAt",
        "updatedAt",
      ],
      where: {
        status: {
          [Op.notIn]: ["Done", "Cancel", "Deleted"],
        },
      },
      order: [["id", "DESC"]],
      limit: 100,
    });
    if (!maintenance[0]) return res.json({ msg: "Belum ada data record" });
    res.json(maintenance);
  } catch (error) {
    console.log(error);
  }
};

///////////////////////////////////////////////////////////////////////////////////////////
// Get List Dismantle Data (NotActive / History) //////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

export const getMaintenanceHistory = async (req, res) => {
  try {
    const maintenance = await Maintenance.findAll({
      attributes: [
        "id",
        "no_wo",
        "jenis_maintenance",
        "nama_client",
        "id_pelanggan",
        "alamat",
        "contact_person",
        "email",
        "status",
        "first_note",
        "last_note",
        "createdAt",
        "updatedAt",
      ],
      where: {
        status: {
          [Op.in]: ["Done", "Cancel"],
        },
      },
      order: [["id", "DESC"]],
      limit: 100,
    });
    if (!maintenance[0]) return res.json({ msg: "Belum ada data record" });
    res.json(maintenance);
  } catch (error) {
    console.log(error);
  }
};

///////////////////////////////////////////////////////////////////////////////////////////
// Add WorkOrder Maintenance //////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

export const addWoMaintenance = async (req, res) => {
  const {
    user_id,
    no_wo,
    jenis_maintenance,
    nama_client,
    id_pelanggan,
    alamat,
    contact_person,
    email,
    first_note,
  } = req.body;
  const status = "Waiting List";
  try {
    await Maintenance.create({
      no_wo: no_wo,
      jenis_maintenance: jenis_maintenance,
      nama_client: nama_client,
      id_pelanggan: id_pelanggan,
      alamat: alamat,
      contact_person: contact_person,
      email: email,
      status: status,
      first_note: first_note,
    });
    const text =
      "Telah diterbitkan WO maintenance (" +
      no_wo +
      ") atas nama: " +
      nama_client +
      ", id pelanggan: " +
      id_pelanggan +
      ", alamat: " +
      alamat +
      ", contact person: " +
      contact_person +
      ", keterangan: " +
      first_note;
    await ActivityLog.create({
      user_id: user_id,
      act_id: 0,
      another_act_id: 0,
      act_sub: "WO Maintenance Diterbitkan",
      act_desk: text,
      status: status,
    });

    //////////////////////////
    //Sending WhatsApp Notif//
    //////////////////////////
    const teamDatas = await Users.findAll();
    // Extract the distinct act_ids
    const distinctPhoneNumbers = [
      ...new Set(teamDatas.map((teamdata) => teamdata.whatsapp)),
    ];

    // Update all corresponding Users
    await Promise.all(
      distinctPhoneNumbers.map(async (phonenumber) => {
        const formData = new FormData();
        formData.append("phonenumber", phonenumber);
        formData.append("text", text);
        const waresponse = await fetch(apiWaUrl, {
          method: "POST",
          body: formData,
        });
        if (!waresponse.ok) {
          throw new Error(`Bad Request: ${waresponse.statusText}`);
        }
      })
    );
    /////////////////////////
    /////////////////////////

    res.json({ msg: "WO maintenance berhasil tersimpan" });
  } catch (error) {
    console.log(error);
    res.json({ msg: "WO maintenance gagal tersimpan" });
  }
};

///////////////////////////////////////////////////////////////////////////////////////////
// Update Edit WorkOrder Maintenance //////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

export const updateWoMaintenance = async (req, res) => {
  const {
    user_id,
    id,
    no_wo,
    jenis_maintenance,
    nama_client,
    id_pelanggan,
    alamat,
    contact_person,
    email,
    first_note,
  } = req.body;
  try {
    const maintenance = await Maintenance.findOne({
      where: {
        id: id,
      },
    });

    if (!maintenance)
      return res.status(404).json({ msg: "Data tidak ditemukan" });

    const status = maintenance.status;

    const text =
      "Pemberitahuan perubahan data pada WO maintenance (" +
      no_wo +
      ") atas nama: " +
      nama_client +
      ", id pelanggan: " +
      id_pelanggan +
      ", alamat: " +
      alamat +
      ", contact person: " +
      contact_person +
      ", status: " +
      status +
      ", Keterangan: " +
      first_note;
    await Maintenance.update(
      {
        jenis_maintenance,
        nama_client,
        id_pelanggan,
        alamat,
        contact_person,
        email,
        first_note,
      },
      {
        where: {
          id: id,
        },
      }
    );
    await ActivityLog.create({
      user_id: user_id,
      act_id: id,
      another_act_id: 0,
      act_sub: "WO Maintenance Updated",
      act_desk: text,
      status: status,
    });
    //////////////////////////
    //Sending WhatsApp Notif//
    //////////////////////////
    const teamDatas = await Users.findAll();
    // Extract the distinct act_ids
    const distinctPhoneNumbers = [
      ...new Set(teamDatas.map((teamdata) => teamdata.whatsapp)),
    ];

    // Update all corresponding Users
    await Promise.all(
      distinctPhoneNumbers.map(async (phonenumber) => {
        const formData = new FormData();
        formData.append("phonenumber", phonenumber);
        formData.append("text", text);
        const waresponse = await fetch(apiWaUrl, {
          method: "POST",
          body: formData,
        });
        if (!waresponse.ok) {
          throw new Error(`Bad Request: ${waresponse.statusText}`);
        }
      })
    );
    /////////////////////////
    /////////////////////////
    res.status(200).json({ msg: "Maintenance data success updated" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

///////////////////////////////////////////////////////////////////////////////////////////
// Add teknisi on WO maintenance //////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

export const addTeknisiWoMaintenance = async (req, res) => {
  const { userId, teknisiId, id } = req.body;

  try {
    const teknisiDatas = await Users.findAll({
      where: { id: teknisiId },
    });

    if (!teknisiDatas.length) {
      return res.status(404).json({ error: "Teknisi not found" });
    }

    const namaTeknisi = teknisiDatas[0].name;

    const woDatas = await Maintenance.findAll({
      where: { id: id },
    });

    if (!woDatas.length) {
      return res.status(404).json({ error: "WO maintenance not found" });
    }

    const no_wo = woDatas[0].no_wo;
    const nama_client = woDatas[0].nama_client;
    const id_pelanggan = woDatas[0].id_pelanggan;
    const alamat = woDatas[0].alamat;
    const contact_person = woDatas[0].contact_person;
    const client_note = woDatas[0].first_note;

    const text = `Teknisi (${namaTeknisi}) berhasil ditambahkan pada WO maintenance: ${no_wo}, Nama Client: ${nama_client}, Id Pelanggan: ${id_pelanggan}, Alamat: ${alamat}, Contact person: ${contact_person}, Note: ${client_note}`;

    await ActivityLog.create({
      user_id: userId,
      act_id: teknisiId,
      another_act_id: id,
      act_sub: "Teknisi Ditambahkan",
      act_desk: text,
      status: "Busy",
    });

    await Users.update(
      {
        status: "Busy",
      },
      {
        where: { id: teknisiId },
      }
    );

    //////////////////////////
    //Sending WhatsApp Notif//
    //////////////////////////
    const teamDatas = await Users.findAll();
    // Extract the distinct act_ids
    const distinctPhoneNumbers = [
      ...new Set(teamDatas.map((teamdata) => teamdata.whatsapp)),
    ];

    // Update all corresponding Users
    await Promise.all(
      distinctPhoneNumbers.map(async (phonenumber) => {
        const formData = new FormData();
        formData.append("phonenumber", phonenumber);
        formData.append("text", text);
        const waresponse = await fetch(apiWaUrl, {
          method: "POST",
          body: formData,
        });
        if (!waresponse.ok) {
          throw new Error(`Bad Request: ${waresponse.statusText}`);
        }
      })
    );
    /////////////////////////
    /////////////////////////

    res.json({
      msg: "Teknisi berhasil ditambahkan pada WorkOrder Maintenance",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

///////////////////////////////////////////////////////////////////////////////////////////
// Delete teknisi on WO Maintenance ///////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

export const deleteTeknisiWoMaintenance = async (req, res) => {
  const { id, teknisiId } = req.params;

  const teknisiDatas = await Users.findAll({
    where: {
      id: teknisiId,
    },
  });
  const namaTeknisi = teknisiDatas[0].name;

  const woDatas = await Maintenance.findAll({
    where: { id: id },
  });
  const no_wo = woDatas[0].no_wo;
  const nama_client = woDatas[0].nama_client;
  const id_pelanggan = woDatas[0].id_pelanggan;

  const text =
    "Status pengerjaan dibatalkan untuk teknisi (" +
    namaTeknisi +
    ") pada WO maintenance (" +
    no_wo +
    " / " +
    nama_client +
    " / " +
    id_pelanggan;

  try {
    await ActivityLog.update(
      {
        act_sub: "Teknisi Dibatalkan",
        act_desk: text,
        status: "Dibatalkan",
      },
      {
        where: {
          act_id: teknisiId,
          another_act_id: id,
          act_desk: {
            [Op.like]: `%maintenance%`,
          },
        },
      }
    );

    await Users.update(
      {
        status: "Available",
      },
      {
        where: {
          id: teknisiId,
        },
      }
    );

    //////////////////////////
    //Sending WhatsApp Notif//
    //////////////////////////
    const teamDatas = await Users.findAll();
    // Extract the distinct act_ids
    const distinctPhoneNumbers = [
      ...new Set(teamDatas.map((teamdata) => teamdata.whatsapp)),
    ];

    // Update all corresponding Users
    await Promise.all(
      distinctPhoneNumbers.map(async (phonenumber) => {
        const formData = new FormData();
        formData.append("phonenumber", phonenumber);
        formData.append("text", text);
        const waresponse = await fetch(apiWaUrl, {
          method: "POST",
          body: formData,
        });
        if (!waresponse.ok) {
          throw new Error(`Bad Request: ${waresponse.statusText}`);
        }
      })
    );
    /////////////////////////
    /////////////////////////

    res.json({ msg: "Teknisi berhasil dibatalkan" });
  } catch (error) {
    console.log(error);
    res.json({ msg: "Proses pembatalan gagal" });
  }
};

///////////////////////////////////////////////////////////////////////////////////////////
// Get data teknisi on Maintenance WorkOrder //////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

export const getTeknisiWoMaintenance = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ error: "Parameter 'no_wo' is missing or invalid" });
    }

    const teknisiWo = await ActivityLog.findAll({
      where: {
        another_act_id: id,
        status: "Busy",
        act_desk: {
          [Op.like]: `%maintenance%`,
        },
      },
      order: [["id", "DESC"]],
    });
    res.json(teknisiWo);
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
  }
};

///////////////////////////////////////////////////////////////////////////////////////////
// Update Report Maintenance  /////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

export const reportMaintenance = async (req, res) => {
  const { user_id, id, no_wo, nama_client, id_pelanggan, status, last_note } =
    req.body;
  try {
    if (
      status === "Done" ||
      status === "Dijadwalkan Ulang" ||
      status === "Cancel"
    ) {
      const teknisiIds = await ActivityLog.findAll({
        where: {
          another_act_id: id,
          act_sub: "Teknisi Ditambahkan",
          act_desk: {
            [Op.like]: `%maintenance%`,
          },
        },
      });
      // Extract the distinct act_ids
      const distinctTeknisiIds = [
        ...new Set(teknisiIds.map((teknisi) => teknisi.act_id)),
      ];

      // Update all corresponding Users
      await Promise.all(
        distinctTeknisiIds.map(async (teknisiId) => {
          await Users.update(
            {
              status: "Available",
            },
            {
              where: { id: teknisiId },
            }
          );
        })
      );
    }
    const text =
      "Pengerjaan " +
      status +
      " untuk WorkOrder (" +
      no_wo +
      ") atas nama (" +
      nama_client +
      " / " +
      id_pelanggan +
      ") dengan status (" +
      status +
      ") keterangan (" +
      last_note +
      ")";
    await Maintenance.update(
      {
        status: status,
        last_note: last_note,
        image_doc_perangkat: null,
      },
      {
        where: { id: id },
      }
    );
    await ActivityLog.create({
      user_id: user_id,
      act_id: id,
      another_act_id: 0,
      act_sub: "Progress WO Maintenance Diperbaharui",
      act_desk: text,
      status: status,
    });
    //////////////////////////
    //Sending WhatsApp Notif//
    //////////////////////////
    const teamDatas = await Users.findAll();
    // Extract the distinct act_ids
    const distinctPhoneNumbers = [
      ...new Set(teamDatas.map((teamdata) => teamdata.whatsapp)),
    ];

    // Update all corresponding Users
    await Promise.all(
      distinctPhoneNumbers.map(async (phonenumber) => {
        const formData = new FormData();
        formData.append("phonenumber", phonenumber);
        formData.append("text", text);
        const waresponse = await fetch(apiWaUrl, {
          method: "POST",
          body: formData,
        });
        if (!waresponse.ok) {
          throw new Error(`Bad Request: ${waresponse.statusText}`);
        }
      })
    );
    /////////////////////////
    /////////////////////////
    res.json({ msg: "Status WO maintenance berhasil diperbaharui" });
  } catch (error) {
    res.json({ error: "Update status progress WO maintenance gagal" });
    console.log(error);
  }
};

///////////////////////////////////////////////////////////////////////////////////////////
// Delete Maintenance Data by id ////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

export const deleteMaintenanceById = async (req, res) => {
  const id = req.params.id;
  const user_id = req.params.userId;
  try {
    const wo = await Maintenance.findAll({
      where: {
        id: id,
      },
    });
    const teknisiIds = await ActivityLog.findAll({
      where: {
        another_act_id: id,
        act_sub: "Teknisi Ditambahkan",
        act_desk: {
          [Op.like]: `%maintenance%`,
        },
      },
    });
    // Extract the distinct act_ids
    const distinctTeknisiIds = [
      ...new Set(teknisiIds.map((teknisi) => teknisi.act_id)),
    ];

    // Update all corresponding Users
    await Promise.all(
      distinctTeknisiIds.map(async (teknisiId) => {
        await Users.update(
          {
            status: "Available",
          },
          {
            where: { id: teknisiId },
          }
        );
      })
    );
    await ActivityLog.create({
      user_id: user_id,
      act_id: id,
      another_act_id: 0,
      act_sub: "WorkOrder Dihapus",
      act_desk: "WorkOrder maintenance (" + wo[0].no_wo + ") berhasil dihapus",
      status: "Deleted",
    });
    await ActivityLog.destroy({
      where: {
        another_act_id: id,
        act_sub: "Teknisi Ditambahkan",
      },
    });
    await ActivityLog.destroy({
      where: {
        act_id: id,
        act_sub: "WorkOrder Diterbitkan",
      },
    });
    await Maintenance.update({ status: "Deleted" }, { where: { id: id } });
    res.status(200).json({ msg: "WorkOrder maintenance deleted" });
  } catch (error) {
    console.log(error.message);
    res.json({ msg: "Failed, proses delete data maintenance gagal" });
  }
};
