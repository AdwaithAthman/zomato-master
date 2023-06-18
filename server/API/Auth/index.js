//Library
import express from "express";

//Models
import { UserModel } from "../../database/user";

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
    try{
        const { email, password, fullName, phoneNumber } = req.body.credentials;
        const user = await UserModel.findByEmailAndPassword(email, password);
        const token = user.generateJwtToken();
        return res.status(200).json({token, status: "Success"})
    }catch(error){
        return res.status(500).json({error: error.message})
    }
});

export default Router;
