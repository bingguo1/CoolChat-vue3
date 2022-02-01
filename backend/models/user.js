const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// let Friend = require('./friend.js');


let userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: String,
    password: String,
    faceurl: String,
    // friends: [Friend.friendSchema],
    friends:[{
        id: String,
        username: String,
        faceurl: String,
    }],
    
}, {
    timestamps: true,
});                       

module.exports = mongoose.model('users', userSchema);
