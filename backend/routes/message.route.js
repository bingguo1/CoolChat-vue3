const express = require('express');
//const faker = require('faker');
const { faker } = require('@faker-js/faker');
const router = express.Router();


const lib = require("../funcs.js");

//let User = require('../models/user.js');
let Message = require('../models/message.js');

router.route("/faker/addMessage/temp/:nMsg").get((req, res, next) => {

    const timenow = Date.now();
    const chatTimeStart = timenow - 1000 * 60 * 30;
    const step = 200;
    const nMsg = req.params.nMsg;
    var content;
    var t0 = chatTimeStart;
    var chattime, user1,user2;

    for (let i = 0; i < nMsg; i++) {
        content = faker.lorem.sentence(nb_words = 8, variable_nb_words = 4);
        chattime=new Date(t0);
         
       
        if(Math.random()>0.5){
            user1="bing";
            user2="Joe15";
        }else{
            user2="bing";
            user1="Joe15";
        }
        console.log("time:", chattime, " content:", content, "user1:",user1);        
        lib.saveMessageToDB(user1,user2, chattime, content);
        t0 += step;
       
    }
    res.json("generated");
});


router.route("/faker/addMessage/:id").get((req, res, next) => {

    const nMessage = req.params.id;
    var user1, user2, content, time, from;
    for (let i = 0; i < nMessage; i++) {
        user1 = faker.name.firstName();
        user2 = faker.name.firstName();
        content = faker.lorem.sentence(nb_words = 8, variable_nb_words = 4);
        // faker.random.arrayElement([user1,user2]);
        time = faker.datatype.datetime();

        lib.saveMessageToDB(user1, user2, time, content);
    }

});

router.route("/getMessage/:id").get((req, res, next) => {
    Message.find({}).limit(req.params.id).sort({ "content": 1 }).then(data => res.json(data))
        .catch(err => console.log("get message fail due to:", err));
});

function findEarlierNMessagesForOneFriend(username,friendname,nMessage, earlierThan){
    const duo = username < friendname ? username + ":" + friendname : friendname + ":" + username;
    return Message.find({ duo, createdAt: { $lt:  earlierThan} }).sort({createdAt: -1}).limit(nMessage);
}


function findUnreadsforOneFriend(username, friendname, nMostMessage, laterThan) {
    const duo = username < friendname ? username + ":" + friendname : friendname + ":" + username;
    console.log("laterThan:", laterThan, "nMostMessage:", nMostMessage)
    return Message.find({ duo, createdAt: { $gt: laterThan } }).sort({createdAt: -1}).limit(nMostMessage).then(data => {
        return {
            friendname,
            newMessages: data,
            nMostMessage
        }
    });
}

//// getNMessagesForAFriend
async function findAllUnreads(username, friend_nUnread_array) {
    const asyncFunctions = [];
    friend_nUnread_array.forEach(({ friendname, latestNMsg, laterThan }) => {
        asyncFunctions.push(findUnreadsforOneFriend(username, friendname, latestNMsg, laterThan));
    });
    const results = await Promise.all(asyncFunctions);
    return results;
}

router.route("/getAllUnreadMessages").post(async function (req, res, next) {

    console.log(" start to get AllUnreadMessages");
    const username = req.body.username;
    const friend_nUnread_array = req.body.friend_nUnread_array;

    const results = await findAllUnreads(username, friend_nUnread_array);
    console.log("getAllUnreadMessages result: ", results);
    res.json(results);

});

router.route("/getNEarlierMessagesForOneFriend").post( (req,res)=>{
    findEarlierNMessagesForOneFriend(req.body.username, req.body.friendname, req.body.nMessage, req.body.earlierThan)
        .then(data=>res.json(data))
        .catch(err=>{
            console.log("getNEarlierMessagesForOneFriend fail due to:",err);
            res.json("sorry, getNEarlierMessagesForOneFriend due to server error");
        });
});

module.exports = router;
