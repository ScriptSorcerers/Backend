const {Backend, User} = require('../Models');
const CreateBackend = require('../GlobalFunction');
const mongoose = require('mongoose');
const addNewBackend = async (req, res) => {
    let {userId, connObj, models} = req.body;
    // console.log("body", req.body)
    // console.log("add New Backend", req.body);
    if(!userId || !connObj || !models){
        console.log("userId, connObj, models are required");
        return res.status(400).json({message: "userId and backendObject are required"});
    }
    if(userId){
        if(!mongoose.Types.ObjectId.isValid(userId)){
            console.log("userId is not valid")
            return res.status(400).json({message: "userId is not valid"});
        }
        const user = await User.findOne({_id: userId});
        if(!user){
            return res.status(400).json({message: "user not found"});
        }
    }
    // if(backendObject){
    //     if(typeof backendObject !== 'object'){
    //         return res.status(400).json({message: "backendObject is not valid"});
    //     }
    // }
    const backendObject = { 
        connObj,
        models
    }
    const newBackend = new Backend({
        userId,
        backendObject
    });
    try {
        const resp = await CreateBackend(req, res)
        if(resp){
            const savedBackend = await newBackend.save();
            return res.status(200).json(savedBackend);
        }
        else{
            return res.status(500).json({message: "error in creating backend"});
        }
    } catch (error) {
        return res.status(500).json({error});
    }
}

const getAllUserBackends = async (req, res) => {
    const {userId} = req.body;
    if(!userId){
        return res.status(400).json({message: "userId is required"});
    }
    if(userId){
        if(!mongoose.Types.ObjectId.isValid(userId)){
            return res.status(400).json({message: "userId is not valid"});
        }
        const user = User.findOne({_id: userId});
        if(!user){
            return res.status(400).json({message: "user not found"});
        }
    }
    try {
        const backends = await Backend.find({userId});
        res.status(200).json(backends);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getLastUserBackend = async (req, res) => {
    console.log("last User Backend", req.body);
    const {userId} = req.body;
    if(!userId){
        return res.status(400).json({message: "userId is required"});
    }
    if(userId){
        if(!mongoose.Types.ObjectId.isValid(userId)){
            return res.status(400).json({message: "userId is not valid"});
        }
        const user = User.findOne({_id: userId});
        if(!user){
            return res.status(400).json({message: "user not found"});
        }
    }
    try {
        const backend = await Backend.findOne({userId}).sort({timestamp: -1});
        return res.status(200).json(backend);
    } catch (error) {
        return res.status(500).json(error);
    }
}

module.exports = {
    addNewBackend,
    getAllUserBackends,
    getLastUserBackend
}