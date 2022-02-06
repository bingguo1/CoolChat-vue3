const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let duoMessageSchema = new Schema({
    duo: String, // user1:user2
    content: String,
    contentType: {
        type: String,
        default: "text"
    },
    from: String
},  {
    timestamps: { createdAt: true, updatedAt: false }
});                       

// only do the following once
//duoMessageSchema.index({ duo: 1});

module.exports = mongoose.model('duoMessages', duoMessageSchema);
