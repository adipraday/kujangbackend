import Bts from "../models/BtsModels.js";

export const getBts = async (req, res) => {
  try {
    const bts = await Bts.findAll({
      attributes: [
        "id",
        "bts_label",
        "bts_id",
        "bts_area",
        "bts_input",
        "bts_output_capacity",
        "bts_output_used",
        "bts_output_available",
      ],
      order: [["id", "DESC"]],
      limit: 100,
    });
    res.json(bts);
  } catch (error) {
    console.log(error);
  }
};

export const getBtsById = async (req, res) => {
  try {
    const btsbyid = await Bts.findAll({
      attributes: [
        "id",
        "bts_label",
        "bts_id",
        "bts_area",
        "bts_input",
        "bts_output_capacity",
        "bts_output_used",
        "bts_output_available",
      ],
      where: {
        id: req.params.id,
      },
    });
    res.json(btsbyid);
  } catch (error) {
    res.json({ msg: "Data BTS tidak ditemukan" });
    console.log(error);
  }
};

export const getAvailableBts = async (req, res) => {
  try {
    const availablebts = await Bts.findAll({
      attributes: [
        "bts_label",
        "bts_id",
        "bts_area",
        "bts_input",
        "bts_output_capacity",
        "bts_output_used",
        "bts_output_available",
      ],
      order: [["bts_label", "ASC"]],
    });
    res.json(availablebts);
  } catch (error) {
    console.log(error);
  }
};

export const addBts = async (req, res) => {
  const {
    bts_label,
    bts_id,
    bts_area,
    bts_input,
    bts_output_capacity,
    bts_output_used,
    bts_output_available,
  } = req.body;
  try {
    await Bts.create({
      bts_label: bts_label,
      bts_id: bts_id,
      bts_area: bts_area,
      bts_input: bts_input,
      bts_output_capacity: bts_output_capacity,
      bts_output_used: bts_output_used,
      bts_output_available: bts_output_available,
    });
    res.json({ msg: "Data BTS berhasil ditambahkan" });
  } catch (error) {
    console.log(error);
  }
};

export const updateBts = async (req, res) => {
  try {
    const bts = await Bts.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!bts) return res.status(404).json({ msg: "Data tidak ditemukan" });
    const {
      bts_label,
      bts_id,
      bts_area,
      bts_input,
      bts_output_capacity,
      bts_output_used,
      bts_output_available,
    } = req.body;
    await Bts.update(
      {
        bts_label,
        bts_id,
        bts_area,
        bts_input,
        bts_output_capacity,
        bts_output_used,
        bts_output_available,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({ msg: "BTS data success updated" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteBtsById = async (req, res) => {
  try {
    await Bts.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "BTS data berhasil di hapus" });
  } catch (error) {
    console.log(error.message);
  }
};
