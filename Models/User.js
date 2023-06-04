const mongoose = require('mongoose');

const transform = (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  };

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        // required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        // required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },  
    joined: {
      type: Number,
      default: ()=>new Date().getTime()
    },
    profilePic:{
      type: String,
      default: "https://picsum.photos/200",
    },
    description: {
      type: String,
      default: "Hey There, I am using BackendBackend"
    },   
},
{
    toJSON: {
      virtuals: true,
      transform,
    },
    toObject: {
      virtuals: true,
      transform,
    },
  }
);
const User = mongoose.model("user",UserSchema);
module.exports = User;