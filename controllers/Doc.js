import Docs from "../models/DocModels.js";

///////////////////////////////////////////////////////////////////////////////////////////
// Get Documentation Records //////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

export const getDocs = async (req, res) => {
  try {
    const docs = await Docs.findAll({
      attributes: [
        "id",
        "subject_id",
        "subject",
        "description",
        "file",
        "createdAt",
        "updatedAt",
      ],
      order: [["id", "DESC"]],
      limit: 100,
    });
    if (!docs[0]) return res.json({ msg: "Belum ada data record" });
    res.json(docs);
  } catch (error) {
    console.log(error);
  }
};

///////////////////////////////////////////////////////////////////////////////////////////
// Get Documentation by Id ////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

export const getDocsById = async (req, res) => {
  try {
    const doc = await Docs.findOne({
      attributes: [
        "id",
        "subject_id",
        "subject",
        "description",
        "file",
        "createdAt",
        "updatedAt",
      ],
      where: {
        id: req.params.id,
      },
    });
    if (!doc) return res.json({ msg: "Documentasi tidak ditemukan" });
    res.json(doc);
  } catch (error) {
    console.log(error);
  }
};

///////////////////////////////////////////////////////////////////////////////////////////
// Get Documentation by Subject Id ////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

export const getDocsBySubjectId = async (req, res) => {
  try {
    const docs = await Docs.findAll({
      attributes: [
        "id",
        "subject_id",
        "subject",
        "description",
        "file",
        "createdAt",
        "updatedAt",
      ],
      where: {
        subject_id: req.params.id,
        subject: req.params.subject,
      },
      order: [["id", "DESC"]],
    });
    if (!docs[0]) return res.json({ msg: "Belum ada dokumentasi" });
    res.json(docs);
  } catch (error) {
    console.log(error);
  }
};

///////////////////////////////////////////////////////////////////////////////////////////
// Upload Documentation ///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

export const uploadDoc = async (req, res) => {
  const { subject_id, subject, description } = req.body;
  const image = req.file.path;
  if (!image) {
    return res.json({ msg: "No file detected" });
  }
  try {
    await Docs.create({
      subject_id: subject_id,
      subject: subject,
      description: description,
      file: image,
    });

    res.json({ msg: "Upload Success" });
  } catch (error) {
    console.error("Error occurred while uploading:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

///////////////////////////////////////////////////////////////////////////////////////////
// Delete Documentation ///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

export const deleteDocById = async (req, res) => {
  try {
    const deletedoc = await Docs.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!deletedoc) {
      return res.status(404).json({ msg: "file tidak ditemukan" });
    } else {
      return res.status(200).json({ msg: "File berhasil dihapus" });
    }
  } catch (error) {
    console.log(error.message);
  }
};
