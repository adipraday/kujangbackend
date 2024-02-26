import Absensi from "../models/AbsensiModels.js";
import Users from "../models/UserModel.js";

export const getAbsensi = async (req, res) => {
  try {
    const absensi = await Absensi.findAll({
      attributes: [
        "id",
        "id_user",
        "nama",
        "tgl_absensi",
        "keterangan",
        "note",
        "doc",
        "createdAt",
        "updatedAt",
      ],
      order: [["id", "DESC"]],
      limit: 100,
    });
    res.json(absensi);
  } catch (error) {
    console.log(error);
  }
};

export const AddAbsensi = async (req, res) => {
  const { id_user, tgl_absensi, keterangan, note } = req.body;
  const user = await Users.findAll({
    where: {
      id: req.body.id_user,
    },
  });
  if (!user[0]) return res.sendStatus(204);
  const nama = user[0].name;
  if (!req.file) {
    return res.json({ msg: "Image harus di upload" });
  }
  const image = req.file.path;
  try {
    await Absensi.create({
      id_user: id_user,
      nama: String(nama),
      tgl_absensi: tgl_absensi,
      keterangan: keterangan,
      note: note,
      doc: image,
    });
    res.json({ msg: "Absebsi Berhasil Ditambahkan" });
  } catch (error) {
    console.log(error);
  }
};

export const getAbsensiById = async (req, res) => {
  const data_absen = await Absensi.findAll({
    where: {
      id_user: req.params.userId,
    },
  });
  if (!data_absen[0]) {
    return res.json({ msg: "Data tidak ditemukan" });
  }
  try {
    const absensibyid = await Absensi.findAll({
      attributes: [
        "id",
        "id_user",
        "nama",
        "tgl_absensi",
        "keterangan",
        "note",
        "doc",
        "createdAt",
        "updatedAt",
      ],
      where: {
        id_user: req.params.userId,
      },
    });
    res.json(absensibyid);
  } catch (error) {
    console.log(error);
  }
};

export const deleteAbsensiById = async (req, res) => {
  const data_absen = await Absensi.findAll({
    where: {
      id: req.params.id,
    },
  });
  if (!data_absen[0]) {
    return res.json({ msg: "Data tidak ditemukan" });
  }
  try {
    await Absensi.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Absen Deleted" });
  } catch (error) {
    console.log(error.message);
  }
};
