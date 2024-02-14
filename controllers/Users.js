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

export const getUserInfoById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Users.findAll({
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
      where: {
        id: id,
      },
    });
    res.json(user);
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
    return res.json({ msg: "Password dan Confirm Password tidak cocok" });
  }

  if (!req.file) {
    return res.json({ msg: "Image harus di upload" });
  }

  const image = req.file.path;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // // Signed up
    // const user = userCredential;
    // console.log(user);

    await Users.create({
      username: username,
      name: name,
      jobdesk: jobdesk,
      aktif_sejak: aktifSejak,
      whatsapp: whatsapp,
      telp: telp,
      email: email,
      profile_picture: image,
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

    // Sign in the user
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Look up the user by email
    const userDetails = await Users.findAll({
      where: {
        email: email,
      },
    });

    if (!userDetails || userDetails.length === 0) {
      // User not found, return appropriate response
      return res.status(404).json({ msg: "User not found" });
    }

    const { id: userId, name, status } = userDetails[0];

    if (status === "Not Active") {
      return res.status(403).json({ msg: "Your access has been disabled" });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { userId, name, email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m", // Adjust expiry time as needed
      }
    );
    const refreshToken = jwt.sign(
      { userId, name, email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Update refresh token in the database
    await Users.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );

    // Set refresh token in the cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiry
    });

    // Return refresh token to the client
    res.json({ refreshToken });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: "An error occurred" });
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
  const { id, username, name, jobdesk, aktif_sejak, whatsapp, telp, status } =
    req.body;
  if (!id) return res.sendStatus(204);
  const user = await Users.findAll({
    where: {
      id: id,
    },
  });
  if (!user[0]) return res.sendStatus(204);
  await Users.update(
    {
      username: username,
      name: name,
      jobdesk: jobdesk,
      aktif_sejak: aktif_sejak,
      whatsapp: whatsapp,
      telp: telp,
      status: status,
    },
    {
      where: {
        id: req.body.id,
      },
    }
  );
  return res.sendStatus(200);
};

export const updateProfilePict = async (req, res) => {
  const { id } = req.body;
  if (!id) return res.sendStatus(204);
  const user = await Users.findAll({
    where: {
      id: id,
    },
  });
  if (!user[0]) return res.sendStatus(204);
  const image = req.file.path;
  await Users.update(
    {
      profile_picture: image,
    },
    {
      where: {
        id: req.body.id,
      },
    }
  );
  return res.json({ msg: "Profile picture updated" });
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
