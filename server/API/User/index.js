//Libraries
import express from "express";

// Database model
import { UserModel } from "../../database/order";

const Router = express.Router();

/*
Route       /user/:_id
Desc        Get user data based on _id
Params      _id
Access      Public
Method      GET
*/
Router.get("/:_id", async (req,res) => {
    try{
        const {_id} = req.params;
        const getUser = await UserModel.findById(_id);

        if(!getUser){
            return res.status(404).json({error: "User not found"});
        }
        return res.json({user: getUser});
    } catch(error){
        return res.status(500).json({error: error.message});
    }
});

/*
Route       /user/update/:userId
Desc        Update user data based on userId
Params      userId  
Access      Public
Method      PUT
*/
Router.put("/update/:userId", async (req,res) => {
    try{
        const {userId} = req.params;
        const {userData} = req.body;
        const updateUserData = await UserModel.findByIdAndUpdate(
            userId,
            {
                $set: userData
            },
            { new: true}
        );
        return res.json({user: updateUserData})
    } catch(error){
        return res.status(500).json({error: error.message});
    }
});

export default Router;