import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { auth } from "../firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: [
        "id",
        "username",
        "name",
        "jobdesk",
        "aktif_sejak",
        "whatsapp",
        "telp",
        "email",
        "status",
      ],
    });
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

export const Register = async (req, res) => {
  const {
    username,
    name,
    jobdesk,
    aktifSejak,
    whatsapp,
    telp,
    email,
    password,
    confPassword,
  } = req.body;

  if (password !== confPassword) {
    return res
      .status(400)
      .json({ msg: "Password dan Confirm Password tidak cocok" });
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    // Signed up
    const user = userCredential;
    console.log(user);

    await Users.create({
      username: username,
      name: name,
      jobdesk: jobdesk,
      aktif_sejak: aktifSejak,
      whatsapp: whatsapp,
      telp: telp,
      email: email,
      status: "Available",
      password: null,
    });

    res.json({ msg: "Register Success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    await signInWithEmailAndPassword(auth, email, password);

    // Use a different variable name (e.g., userEmail) to avoid shadowing
    const user = await Users.findAll({
      where: {
        email: email,
      },
    });

    const userId = user[0].id;
    const name = user[0].name;

    const accessToken = jwt.sign(
      { userId, name, email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "20s",
      }
    );
    const refreshToken = jwt.sign(
      { userId, name, email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    await Users.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ refreshToken });
  } catch (error) {
    res.status(404).json({ msg: "Email tidak ditemukan" });
  }
};

export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.sendStatus(204); // No refresh token, no action needed
  }

  try {
    const user = await Users.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });

    if (!user) {
      return res.sendStatus(204); // Invalid refresh token, no action needed
    }

    const userId = user.id;

    // Clear the refresh token in the database
    await Users.update(
      { refresh_token: null },
      {
        where: {
          id: userId,
        },
      }
    );

    // Clear the refresh token cookie
    res.clearCookie("refreshToken");

    return res.sendStatus(200); // Logout successful
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  const { id, username, name, email } = req.body;
  if (!id) return res.sendStatus(204);
  const user = await Users.findAll({
    where: {
      id: id,
    },
  });
  if (!user[0]) return res.sendStatus(204);
  await Users.update(
    { username: username, name: name, email: email },
    {
      where: {
        id: req.body.id,
      },
    }
  );
  return res.sendStatus(200);
};

export const getAvailableTechnician = async (req, res) => {
  try {
    const availabletechnician = await Users.findAll({
      where: {
        jobdesk: "Network Enginer",
        status: "Available",
      },
      attributes: ["id", "name", "jobdesk", "status"],
    });
    res.json(availabletechnician);
  } catch (error) {
    console.log(error);
  }
};
