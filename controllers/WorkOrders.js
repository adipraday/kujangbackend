import WorkOrders from "../models/WOModels.js";
import ActivityLog from "../models/ActivityLogModels.js";
import Users from "../models/UserModel.js";
import { Op } from "sequelize";
import Fat from "../models/FatModels.js";
const apiWaUrl =
  "https://api.360messenger.net/sendMessage/FlHHLUSjjcAWgramCMz9Mkvb4UHljWqf1sg";

///////////////////////////////////////////////////////////////////////////////////////////
// Get WorkOrder (Active) list ////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

export const getWorkOrders = async (req, res) => {
  try {
    const workorders = await WorkOrders.findAll({
      attributes: [
        "id",
        "no_wo",
        "nama_client",
        "id_pelanggan",
        "alamat",
        "contact_person",
        "email",
        "tikor",
        "link_tikor",
        "paket_berlangganan",
        "note",
        "label_fat",
        "status",
        "createdAt",
        "updatedAt",
      ],
      where: {
        status: {
          [Op.notIn]: ["Done", "Cancel", "Deleted"],
        },
      },
      order: [["id", "DESC"]],
    });
    res.json(workorders);
  } catch (error) {
    console.log(error);
  }
};

///////////////////////////////////////////////////////////////////////////////////////////
// Get Riwayat WorkOrder (NotActive) list /////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

export const getRiwayatWorkOrders = async (req, res) => {
  try {
    const workorders = await WorkOrders.findAll({
      attributes: [
        "id",
        "no_wo",
        "nama_client",
        "id_pelanggan",
        "alamat",
        "contact_person",
        "email",
        "tikor",
        "link_tikor",
        "paket_berlangganan",
        "note",
        "label_fat",
        "status",
        "createdAt",
        "updatedAt",
      ],
      where: {
        status: ["Done", "Cancel"],
      },
      order: [["id", "DESC"]],
      limit: 100,
    });
    res.json(workorders);
  } catch (error) {
    console.log(error);
  }
};

///////////////////////////////////////////////////////////////////////////////////////////
// Get WorkOrder by Id ////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

export const getWorkOrdersById = async (req, res) => {
  try {
    const workorders = await WorkOrders.findAll({
      where: {
        id: req.params.id,
      },
      attributes: [
        "id",
        "no_wo",
        "nama_client",
        "id_pelanggan",
        "alamat",
        "contact_person",
        "email",
        "tikor",
        "link_tikor",
        "paket_berlangganan",
        "note",
        "label_fat",
        "status",
        "createdAt",
        "updatedAt",
      ],
    });
    res.json(workorders);
  } catch (error) {
    console.log(error);
  }
};

///////////////////////////////////////////////////////////////////////////////////////////
// Add new WorkOrder //////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

export const addWorkOrder = async (req, res) => {
  const {
    user_id,
    no_wo,
    nama_client,
    id_pelanggan,
    alamat,
    contact_person,
    email,
    tikor,
    link_tikor,
    paket_berlangganan,
    note,
    label_fat,
  } = req.body;
  const status = "Waiting List";
  try {
    await WorkOrders.create({
      no_wo: no_wo,
      nama_client: nama_client,
      id_pelanggan: id_pelanggan,
      alamat: alamat,
      contact_person: contact_person,
      email: email,
      tikor: tikor,
      link_tikor: link_tikor,
      paket_berlangganan: paket_berlangganan,
      note: note,
      label_fat: label_fat,
      status: status,
    });
    await Fat.create({
      fat_label: 0,
      fat_id: label_fat,
      fat_area: 0,
      fat_input: 0,
      fat_output_capacity: 0,
      fat_output_used: 0,
      fat_output_available: 0,
    });
    const text =
      "Telah diterbitkan WorkOrder (" +
      no_wo +
      ") atas nama: " +
      nama_client +
      ", id pelanggan: " +
      id_pelanggan +
      ", alamat: " +
      alamat +
      ", contact person: " +
      contact_person +
      ", paket berlangganan: " +
      paket_berlangganan +
      ", FAT input: " +
      label_fat;
    await ActivityLog.create({
      user_id: user_id,
      act_id: 0,
      another_act_id: 0,
      act_sub: "WorkOrder Diterbitkan",
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

    res.json({ msg: "Work Order berhasil tersimpan" });
  } catch (error) {
    console.log(error);
    res.json({ msg: "Work Order gagal tersimpan" });
  }
};

///////////////////////////////////////////////////////////////////////////////////////////
// Update WordOrder data //////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

export const updateWorkOrder = async (req, res) => {
  const {
    userId,
    id,
    no_wo,
    nama_client,
    id_pelanggan,
    alamat,
    contact_person,
    email,
    tikor,
    link_tikor,
    paket_berlangganan,
  } = req.body;
  if (!id) return res.sendStatus(204);
  const workorder = await WorkOrders.findAll({
    where: {
      id: id,
    },
  });
  if (!workorder[0]) return res.sendStatus(204);
  try {
    await WorkOrders.update(
      {
        nama_client: nama_client,
        id_pelanggan: id_pelanggan,
        alamat: alamat,
        contact_person: contact_person,
        email: email,
        tikor: tikor,
        link_tikor: link_tikor,
        paket_berlangganan: paket_berlangganan,
      },
      {
        where: {
          id: req.body.id,
        },
      }
    );

    const text =
      "Pemberitahuan perubahan data pada WorkOrder (" +
      no_wo +
      ") atas nama: " +
      nama_client +
      ", id pelanggan: " +
      id_pelanggan +
      ", alamat: " +
      alamat +
      ", contact person: " +
      contact_person +
      ", paket berlangganan: " +
      paket_berlangganan;

    await ActivityLog.create({
      user_id: userId,
      act_id: id,
      another_act_id: 0,
      act_sub: "Data WorkOrder Diperbaharui",
      act_desk: text,
      status: "Updated",
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

    res.json({ msg: "Data berhasil di update" });
  } catch (error) {
    console.log(error);
  }
};

///////////////////////////////////////////////////////////////////////////////////////////
// Update progress WordOrder //////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

export const updateProgressWo = async (req, res) => {
  const {
    userId,
    id,
    no_wo,
    nama_client,
    id_pelanggan,
    label_fat,
    note,
    status,
  } = req.body;
  try {
    if (status === "Done" || status === "Cancel") {
      const teknisiIds = await ActivityLog.findAll({
        where: {
          another_act_id: id,
          act_sub: "Teknisi Ditambahkan",
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
      note +
      ")";
    await WorkOrders.update(
      {
        note: note,
        label_fat: label_fat,
        status: status,
      },
      {
        where: { id: id },
      }
    );
    await ActivityLog.create({
      user_id: userId,
      act_id: id,
      another_act_id: 0,
      act_sub: "Progress WorkOrder Diperbaharui",
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
    res.json({ msg: "Status WorkOrder berhasil diperbaharui" });
  } catch (error) {
    res.json({ error: "Update status progress WO gagal" });
    console.log(error);
  }
};

///////////////////////////////////////////////////////////////////////////////////////////
// Add teknisi on WorkOrder ///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

export const addTeknisiWo = async (req, res) => {
  const { userId, teknisiId, id } = req.body;

  try {
    const teknisiDatas = await Users.findAll({
      where: { id: teknisiId },
    });

    if (!teknisiDatas.length) {
      return res.status(404).json({ error: "Teknisi not found" });
    }

    const namaTeknisi = teknisiDatas[0].name;

    const woDatas = await WorkOrders.findAll({
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
    const fat_input = woDatas[0].label_fat;

    const text = `Teknisi (${namaTeknisi}) berhasil ditambahkan pada WorkOrder: ${no_wo}, Nama Client: ${nama_client}, Id Pelanggan: ${id_pelanggan}, Alamat: ${alamat}, Contact person: ${contact_person}, FAT Input: ${fat_input}`;

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
// Get data teknisi on WorkOrder //////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

export const getTeknisiWo = async (req, res) => {
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
      },
      order: [["id", "DESC"]],
    });
    res.json(teknisiWo);
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
  }
};

///////////////////////////////////////////////////////////////////////////////////////////
// Delete teknisi on WorkOrder ////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

export const deleteTeknisiWo = async (req, res) => {
  const { id, teknisiId } = req.params;

  const teknisiDatas = await Users.findAll({
    where: {
      id: teknisiId,
    },
  });
  const namaTeknisi = teknisiDatas[0].name;

  const woDatas = await WorkOrders.findAll({
    where: { id: id },
  });
  const no_wo = woDatas[0].no_wo;
  const nama_client = woDatas[0].nama_client;
  const id_pelanggan = woDatas[0].id_pelanggan;

  const text =
    "Status pengerjaan dibatalkan untuk teknisi (" +
    namaTeknisi +
    ") pada WorkOrder (" +
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
// Delete WorkOrder by Id

export const deleteWorkOrderById = async (req, res) => {
  const id = req.params.id;
  const userId = req.params.userId;
  try {
    const wo = await WorkOrders.findAll({
      where: {
        id: id,
      },
    });
    const teknisiId = await ActivityLog.findAll({
      where: {
        act_id: id,
      },
    });
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
    await ActivityLog.create({
      user_id: userId,
      act_id: id,
      another_act_id: 0,
      act_sub: "WorkOrder Dihapus",
      act_desk: "WorkOrder (" + wo[0].no_wo + ") berhasil dihapus",
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
    await WorkOrders.update({ status: "Deleted" }, { where: { id: id } });
    res.status(200).json({ msg: "Work Order Deleted" });
  } catch (error) {
    console.log(error.message);
    res.json({ msg: "Proses delete data gagal" });
  }
};

///////////////////////////////////////////////////////////////////////////////////////////
