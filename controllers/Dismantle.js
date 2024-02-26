import WorkOrders from "../models/WOModels.js";
import Dismantle from "../models/DismantleModels.js";
import ActivityLog from "../models/ActivityLogModels.js";
import Users from "../models/UserModel.js";
import { Op } from "sequelize";
import Fat from "../models/FatModels.js";
const apiWaUrl =
  "https://api.360messenger.net/sendMessage/FlHHLUSjjcAWgramCMz9Mkvb4UHljWqf1sg";

///////////////////////////////////////////////////////////////////////////////////////////
// Get All Dismantle List /////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

export const getDismantleList = async (req, res) => {
  try {
    const dismantles = await Dismantle.findAll({
      attributes: [
        "id",
        "no_wo",
        "nama_client",
        "id_pelanggan",
        "alamat",
        "contact_person",
        "email",
        "input_fat",
        "status",
        "client_note",
        "teknisi_note",
        "perangkat_note",
        "image_doc_perangkat",
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
    res.json(dismantles);
  } catch (error) {
    console.log(error);
  }
};

///////////////////////////////////////////////////////////////////////////////////////////
// Get Dismantle Data by id ///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

export const getDismantleById = async (req, res) => {
  try {
    const dismantlebyid = await Dismantle.findAll({
      attributes: [
        "id",
        "no_wo",
        "nama_client",
        "id_pelanggan",
        "alamat",
        "contact_person",
        "email",
        "input_fat",
        "status",
        "client_note",
        "teknisi_note",
        "perangkat_note",
        "image_doc_perangkat",
        "createdAt",
        "updatedAt",
      ],
      where: {
        id: req.params.id,
      },
    });
    res.json(dismantlebyid);
  } catch (error) {
    res.json({ msg: "Data dismantle tidak ditemukan" });
    console.log(error);
  }
};

///////////////////////////////////////////////////////////////////////////////////////////
// Add / Post Dismantle Data //////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

export const addDismantle = async (req, res) => {
  const {
    user_id,
    no_wo,
    nama_client,
    id_pelanggan,
    alamat,
    contact_person,
    email,
    input_fat,
    client_note,
  } = req.body;
  const status = "Waiting List";
  const text =
    "Telah diterbitkan WO dismantle (" +
    no_wo +
    ") atas nama: " +
    nama_client +
    ", id pelanggan: " +
    id_pelanggan +
    ", alamat: " +
    alamat +
    ", contact person: " +
    contact_person +
    ", dengan status: " +
    status +
    ", note: " +
    client_note;
  try {
    await Dismantle.create({
      no_wo: no_wo,
      nama_client: nama_client,
      id_pelanggan: id_pelanggan,
      alamat: alamat,
      contact_person: contact_person,
      email: email,
      input_fat: input_fat,
      status: status,
      client_note: client_note,
    });
    await ActivityLog.create({
      user_id: user_id,
      act_id: 0,
      another_act_id: 0,
      act_sub: "WO Dismantle Diterbitkan",
      act_desk: text,
      status: status,
    });
    const fat_check = await Fat.findOne({
      where: {
        fat_id: input_fat,
      },
    });
    if (!fat_check) {
      // If fat_check is null, create a new record
      await Fat.create({
        fat_label: 0,
        fat_id: input_fat,
        fat_area: 0,
        fat_input: 0,
        fat_output_capacity: 0,
        fat_output_used: 0,
        fat_output_available: 0, // Assuming initial capacity is 1
      });
    } else {
      // Update existing record
      const update_output_used = fat_check.fat_output_used - 1;
      const update_output_available = fat_check.fat_output_available + 1;
      await Fat.update(
        {
          fat_output_used: update_output_used,
          fat_output_available: update_output_available,
        },
        {
          where: {
            fat_id: input_fat,
          },
        }
      );
    }
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
    res.json({ msg: "Data dismantle berhasil ditambahkan" });
  } catch (error) {
    console.log(error);
  }
};

///////////////////////////////////////////////////////////////////////////////////////////
// Edit / Update Dismantle Data ///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

export const updateDismantle = async (req, res) => {
  const {
    user_id,
    id,
    no_wo,
    nama_client,
    id_pelanggan,
    alamat,
    contact_person,
    email,
    input_fat,
    client_note,
  } = req.body;
  try {
    const dismantle = await Dismantle.findOne({
      where: {
        id: id,
      },
    });

    if (!dismantle)
      return res.status(404).json({ msg: "Data tidak ditemukan" });

    const status = dismantle.status;

    const text =
      "Pemberitahuan perubahan data pada WO dismantle (" +
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
      ", Note: " +
      client_note;
    await Dismantle.update(
      {
        nama_client,
        id_pelanggan,
        alamat,
        contact_person,
        email,
        input_fat,
        status,
        client_note,
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
      act_sub: "WO Dismantle Updated",
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
    res.status(200).json({ msg: "Dismantle data success updated" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

///////////////////////////////////////////////////////////////////////////////////////////
// Add teknisi on WorkOrder ///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

export const addTeknisiWoDismantle = async (req, res) => {
  const { userId, teknisiId, id } = req.body;

  try {
    const teknisiDatas = await Users.findAll({
      where: { id: teknisiId },
    });

    if (!teknisiDatas.length) {
      return res.status(404).json({ error: "Teknisi not found" });
    }

    const namaTeknisi = teknisiDatas[0].name;

    const woDatas = await Dismantle.findAll({
      where: { id: id },
    });

    if (!woDatas.length) {
      return res.status(404).json({ error: "WorkOrder not found" });
    }

    const no_wo = woDatas[0].no_wo;
    const nama_client = woDatas[0].nama_client;
    const id_pelanggan = woDatas[0].id_pelanggan;
    const alamat = woDatas[0].alamat;
    const contact_person = woDatas[0].contact_person;
    const client_note = woDatas[0].client_note;

    const text = `Teknisi (${namaTeknisi}) berhasil ditambahkan pada WO dismantle: ${no_wo}, Nama Client: ${nama_client}, Id Pelanggan: ${id_pelanggan}, Alamat: ${alamat}, Contact person: ${contact_person}, Note: ${client_note}`;

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

    res.json({ msg: "Teknisi berhasil ditambahkan" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

///////////////////////////////////////////////////////////////////////////////////////////
// Delete teknisi on WO Dismantle /////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

export const deleteTeknisiWoDismantle = async (req, res) => {
  const { id, teknisiId } = req.params;

  const teknisiDatas = await Users.findAll({
    where: {
      id: teknisiId,
    },
  });
  const namaTeknisi = teknisiDatas[0].name;

  const woDatas = await Dismantle.findAll({
    where: { id: id },
  });
  const no_wo = woDatas[0].no_wo;
  const nama_client = woDatas[0].nama_client;
  const id_pelanggan = woDatas[0].id_pelanggan;

  const text =
    "Status pengerjaan dibatalkan untuk teknisi (" +
    namaTeknisi +
    ") pada WO dismantle (" +
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
            [Op.like]: `%dismantle%`,
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
// Get data teknisi on Dismantle WorkOrder //////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

export const getTeknisiWoD = async (req, res) => {
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
          [Op.like]: `%dismantle%`,
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
// Update Report Dismantle  ///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

export const reportDismantle = async (req, res) => {
  const {
    user_id,
    id,
    no_wo,
    nama_client,
    id_pelanggan,
    status,
    teknisi_note,
    perangkat_note,
  } = req.body;
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
            [Op.like]: `%dismantle%`,
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
      ") note (" +
      teknisi_note +
      ") status perangkat (" +
      perangkat_note +
      ")";
    await Dismantle.update(
      {
        status: status,
        teknisi_note: teknisi_note,
        perangkat_note: perangkat_note,
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
      act_sub: "Progress WO Dismantle Diperbaharui",
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
    res.json({ msg: "Status WO dismantle berhasil diperbaharui" });
  } catch (error) {
    res.json({ error: "Update status progress WO dismantle gagal" });
    console.log(error);
  }
};

///////////////////////////////////////////////////////////////////////////////////////////
// Delete Dismantle Data by id ////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

export const deleteDismantleById = async (req, res) => {
  const id = req.params.id;
  const user_id = req.params.userId;
  try {
    const wo = await Dismantle.findAll({
      where: {
        id: id,
      },
    });
    const teknisiIds = await ActivityLog.findAll({
      where: {
        another_act_id: id,
        act_sub: "Teknisi Ditambahkan",
        act_desk: {
          [Op.like]: `%dismantle%`,
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
      act_desk: "WorkOrder dismantle (" + wo[0].no_wo + ") berhasil dihapus",
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
    await Dismantle.update({ status: "Deleted" }, { where: { id: id } });
    res.status(200).json({ msg: "WorkOrder Dismantle Deleted" });
  } catch (error) {
    console.log(error.message);
    res.json({ msg: "Proses delete data gagal" });
  }
};

///////////////////////////////////////////////////////////////////////////////////////////
// Get Riwayat WO Dismantle (NotActive) list //////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

export const getRiwayatWoDismantles = async (req, res) => {
  try {
    const wodismantles = await Dismantle.findAll({
      attributes: [
        "id",
        "no_wo",
        "nama_client",
        "id_pelanggan",
        "alamat",
        "contact_person",
        "email",
        "input_fat",
        "status",
        "client_note",
        "teknisi_note",
        "perangkat_note",
        "image_doc_perangkat",
        "createdAt",
        "updatedAt",
      ],
      where: {
        status: ["Done", "Cancel"],
      },
      order: [["id", "DESC"]],
      limit: 100,
    });
    res.json(wodismantles);
  } catch (error) {
    console.log(error);
  }
};
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
