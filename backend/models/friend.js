const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const friendSchema=new Schema({
    id: String,
    username :String,
    faceurl: String,
    lastSeen: {        
        type: Date,
        default: Date.now()
    },
});

const friendModel=mongoose.model('friends', friendSchema);
module.exports={
    friendSchema,
    friendModel
}
