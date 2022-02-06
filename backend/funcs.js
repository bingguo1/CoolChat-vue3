
const Message=require('./models/message.js');

function saveMessageToDB(from, to, time, content, contentType="text"){
    const duo=from<to?from+":"+to:to+":"+from;
    const message=new Message({
        duo,
        createdAt: time,
        content,
        contentType,
        from        
    });
    console.log("message to save:", message);
    message.save().then(()=>console.log("save Message succeed"))
        .catch((err)=>console.log("save message fail due to:",err));                     
}

module.exports = {
    saveMessageToDB
};

