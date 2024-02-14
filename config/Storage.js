import multer from "multer";

const storage_profile_picts = multer.diskStorage({
  destination: "user_pictures/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload_profile_pict = multer({ storage: storage_profile_picts });

export { storage_profile_picts, upload_profile_pict };
