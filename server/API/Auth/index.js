//Library
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Models
import { UserModel } from "../../database/user";

const Router = express.Router();

/*
Route       /signup
Desc        Register new user
Params      none
Access      Public
Method      POST
*/
Router.post("/signup", async (req, res) => {
  try {
    const { email, password, fullName, phoneNumber } = req.body.credentials;
    const checkUserByEmail = await UserModel.findOne({ email });
    const checkUserByPhone = await UserModel.findOne({ phoneNumber });

    //Check whether email or phone number exists
    if (checkUserByEmail || checkUserByPhone) {
      return res.json({ error: "User already exists!" });
    }

    //Hashing password
    const bcryptSalt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(password, bcryptSalt);

    //save to DB
    await UserModel.create({
      ...req.body.credentials,
      password: hashedPassword,
    });

    //generate JWT auth token
    const token = jwt.sign({ user: {fullName, email}}, process.env.JWT_SECRET, {expiresIn: "1d"} );

    return res.status(200).json({ token, status: "Success" });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});