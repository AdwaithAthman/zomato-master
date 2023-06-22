//Library
import express from "express";
import passport from "passport";

//Models
import { UserModel } from "../../database/user";

//validation
import { ValidateSignup, ValidateSignin } from "../../validation/auth";

const Router = express.Router();

/*
Route       /auth/signup
Desc        Register new user
Params      none
Access      Public
Method      POST
*/
Router.post("/signup", async (req, res) => {
  try {
    await ValidateSignup(req.body.credentials);
    const { email, password, fullName, phoneNumber } = req.body.credentials;
    await UserModel.findByEmailAndPhone(email, phoneNumber);

    //hashing and salting is done in the pre save method

    //save to DB
    const newUser = await UserModel.create({
      ...req.body.credentials,
    });

    //generate JWT auth token
    const token = newUser.generateJwtToken();

    return res.status(200).json({ token, status: "Success" });
  } catch (error) {
    return res.status(500).json({ error: error.message, status: "Failed" });
  }
});

/*
Route       /auth/signin
Desc        Signin with email and password
Params      none
Access      Public
Method      POST
*/
Router.post("/signin", async (req, res) => {
  try {
    await ValidateSignin(req.body.credentials);
    const { email, password, fullName, phoneNumber } = req.body.credentials;
    const user = await UserModel.findByEmailAndPassword(email, password);
    const token = user.generateJwtToken();
    return res.status(200).json({ token, status: "Success" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/*
Route       /auth/google
Desc        Google signin
Params      none
Access      Public
Method      GET
*/
Router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);

/*
Route       /auth/google/callback
Desc        Google callback function
Params      none
Access      Public
Method      GET
*/
Router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Successful authentication, redirect home.
    return res.json({ user: req.session.passport.user.token });
   /* return res.redirect(
      `http://localhost:4000/google/${req.session.passport.user.token}`
    );*/
  }
);

export default Router;
