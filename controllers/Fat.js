import Fat from "../models/FatModels.js";

export const getFat = async (req, res) => {
  try {
    const fat = await Fat.findAll({
      attributes: [
        "id",
        "fat_label",
        "fat_id",
        "fat_area",
        "fat_input",
        "fat_output_capacity",
        "fat_output_used",
        "fat_output_available",
      ],
      order: [["id", "DESC"]],
      limit: 100,
    });
    res.json(fat);
  } catch (error) {
    console.log(error);
  }
};

export const getFatById = async (req, res) => {
  try {
    const fatbyid = await Fat.findAll({
      attributes: [
        "id",
        "fat_label",
        "fat_id",
        "fat_area",
        "fat_input",
        "fat_output_capacity",
        "fat_output_used",
        "fat_output_available",
      ],
      where: {
        id: req.params.id,
      },
    });
    res.json(fatbyid);
  } catch (error) {
    console.log(error);
  }
};

export const getAvailableFat = async (req, res) => {
  try {
    const availablefat = await Fat.findAll({
      attributes: [
        "fat_label",
        "fat_id",
        "fat_area",
        "fat_input",
        "fat_output_capacity",
        "fat_output_used",
        "fat_output_available",
      ],
      order: [["fat_label", "ASC"]],
    });
    res.json(availablefat);
  } catch (error) {
    console.log(error);
  }
};

export const addFat = async (req, res) => {
  const {
    fat_label,
    fat_id,
    fat_area,
    fat_input,
    fat_output_capacity,
    fat_output_used,
    fat_output_available,
  } = req.body;
  try {
    await Fat.create({
      fat_label: fat_label,
      fat_id: fat_id,
      fat_area: fat_area,
      fat_input: fat_input,
      fat_output_capacity: fat_output_capacity,
      fat_output_used: fat_output_used,
      fat_output_available: fat_output_available,
    });
    res.json({ msg: "Data FAT berhasil ditambahkan" });
  } catch (error) {
    console.log(error);
  }
};

export const updateFat = async (req, res) => {
  try {
    const fat = await Fat.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!fat) return res.status(404).json({ msg: "Data tidak ditemukan" });
    const {
      fat_label,
      fat_id,
      fat_area,
      fat_input,
      fat_output_capacity,
      fat_output_used,
      fat_output_available,
    } = req.body;
    await Fat.update(
      {
        fat_label,
        fat_id,
        fat_area,
        fat_input,
        fat_output_capacity,
        fat_output_used,
        fat_output_available,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({ msg: "FAT data success updated" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteFatById = async (req, res) => {
  try {
    await Fat.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "FAT data berhasil di hapus" });
  } catch (error) {
    console.log(error.message);
  }
};
