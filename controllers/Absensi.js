import Absensi from "../models/AbsensiModels.js";
import Users from "../models/UserModel.js";

export const getAbsensi = async(req, res) => {
    try {
        const absensi = await Absensi.findAll({
            attributes:['id','id_user','nama','tgl_absensi','keterangan','note'],
            order: [
                ['id', 'DESC'],
            ],
            limit:100
        });
        res.json(absensi);
    } catch (error) {
        console.log(error);
    }
}

export const AddAbsensi = async(req, res) => {
    const { id_user, tgl_absensi, keterangan, note } = req.body;
    const user = await Users.findAll({
        where: {
            id: req.body.id_user
        }
    });
    if(!user[0]) return res.sendStatus(204);
    const nama = user[0].name;
    try {
        await Absensi.create({
            id_user: id_user,
            nama: String(nama),
            tgl_absensi: tgl_absensi,
            keterangan: keterangan,
            note: note
        });
        res.json({msg: "Absebsi Berhasil Ditambahkan"});
    }catch(error){
        console.log(error);
    }
}

export const getAbsensiById = async(req, res) => {
    try {
        const absensibyid = await Absensi.findAll({
            attributes:['id','id_user','nama','tgl_absensi','keterangan','note'],
            where: {
                id_user: req.body.id_user
            }
        });
        res.json(absensibyid);
    } catch (error) {
        console.log(error);
    }
}

export const deleteAbsensiById = async(req, res) => {
    try {
        await Absensi.destroy({
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Absen Deleted"});
    } catch (error) {
        console.log(error.message);
    }
}
