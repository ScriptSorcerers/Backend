const mongoose = require('mongoose');

const transform = (doc, ret)=>{
    delete ret._id;
    delete ret.__v;
    return ret;
}

const BackendSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    backendObject: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
},
{
    toJSON:{
        virtuals:true,
        transform
    },
    toObject:{
        virtuals:true,
        transform
    },
}
);

const Backend = mongoose.model('Backend', BackendSchema);