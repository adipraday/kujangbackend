import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const refreshToken = authHeader && authHeader.split(" ")[1];
    if (!refreshToken) return res.sendStatus(401);
    const user = await Users.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!user[0]) return res.sendStatus(403);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) return res.sendStatus(403);
        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const jobdesk = user[0].jobdesk;
        const profilepicture = user[0].profile_picture;
        const accessToken = jwt.sign(
          { userId, name, email, jobdesk, profilepicture },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "15s",
          }
        );
        res.json({ accessToken });
      }
    );
  } catch (error) {
    console.log(error);
  }
};
