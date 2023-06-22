//Libraries
import express from "express";

// Database model
import { OrderModel } from "../../database/order";

const Router = express.Router();

/*
Route       /order/:_id
Desc        Get all orders based on _id
Params      _id
Access      Public
Method      GET
*/
Router.get("/:_id", async (req,res) => {
    try{
        const {_id} = req.params;
        const getOrders = await OrderModel.findOne({ user: _id});

        if(!getOrders){
            return res.status(404).json({erro: "User not found"});
        }
        return res.status(200).json({getOrders});
    } catch(error){
        return res.status(500).json({error: error.message});
    };
});

/*
Route       /order/new/:_id
Desc        Get all orders based on _id
Params      _id
Access      Public
Method      POST
*/
Router.post("/new/:_id", async (req,res) => {
    try{
        const {_id} = req.params;
        const {orderDetails} = req.body;

        const addNewOrder = await OrderModel.findOneAndUpdate({
            user: _id
        },{
            $push: {orderDetails}
        },{
            new: true
        });

        return res.json({ order: addNewOrder })
    } catch(error){
        return res.status(500).json({error: error.message});
    };
});

export default Router;