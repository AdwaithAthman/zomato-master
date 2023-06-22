//Libraries
import express from "express";

// Database model
import { ReviewModel } from "../../database/order";

//validation
import  { ValidateRestaurantId} from "../../validation/food";

const Router = express.Router();

/*
Route       /review/:resId
Desc        Get all reviews related to a particular restaurant based on resid
Params      resid
Access      Public
Method      GET
*/
Router.get("/:resId", async(req,res) => {
    try{
        await ValidateRestaurantId(req.params);
        const {resId} = req.params;
        const reviews = await ReviewModel.find({restaurant: resId});
        return res.json({reviews});
    } catch(error){
        return res.status(500).json({error: error.message});
    }
});

/*
Route       /review/new
Desc        Add new food review/rating
Params      none
Body        review object
Access      Public
Method      POST
*/
Router.post("/new", async(req,res) => {
    try{
        const {reviewData} = req.body;
        await ReviewModel.create(...reviewData);
        return res.status(200).json({ review: "Successfully Created Review."})
    } catch(error){
        return res.status(500).json({error: error.message});
    }
});

/*
Route       /review/delete/:_id
Desc        Delete food review/rating
Params      _id
Access      Public
Method      DELETE
*/
Router.delete("/delete/:_id", async(req,res) => {
    try{
        const {_id} = req.params;
        await ReviewModel.findByIdAndDelete(_id);
        return res.status(200).json({ review: "Successfully Deleted the Review."});
    } catch(error){
        return res.status(500).json({error: error.message});
    }
});

export default Router;