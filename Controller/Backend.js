const {Backend, User} = require('../Models');
const CreateBackend = require('../GlobalFunction');

const addNewBackend = async (req, res) => {
    await CreateBackend(req, res);
    return;
    const {userId, backendObject} = req.body;
    if(!userId || !backendObject){
        return res.status(400).json({message: "userId and backendObject are required"});
    }
    if(userId){
        if(!mongoose.Types.ObjectId.isValid(userId)){
            return res.status(400).json({message: "userId is not valid"});
        }
        const user = await User.findOne({_id: userId});
        if(!user){
            return res.status(400).json({message: "user not found"});
        }
    }
    if(backendObject){
        if(typeof backendObject !== 'object'){
            return res.status(400).json({message: "backendObject is not valid"});
        }
    }

    const newBackend = new Backend({
        userId,
        backendObject
    });
    try {
        const savedBackend = await newBackend.save();
        res.status(200).json(savedBackend);
    } catch (error) {
        res.status(500).json(error);
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
        res.status(200).json(backend);
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = {
    addNewBackend,
    getAllUserBackends,
    getLastUserBackend
}