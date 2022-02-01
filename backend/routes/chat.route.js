const express = require('express');
const router = express.Router();


let User = require('../models/user.js');
// let Friend = require('../models/friend.js');
// router.route('/chatinit').post((req, res, next) => {
//     User.findOne({ username: req.body.username}, function (err, docs){
//         if (error) {
//             return next(error)
//         } else {
//             console.log("find data successfully and sending them as json");
//             res.json(data);
//         }
//     });
// });

async function addfrient2eachother(req,res,next){
    try{
        const [friendA, friendB] = await Promise.all([
            User.findById(req.body.userAid).then(data=>
                new Object({  //// you can use Friend.friendModel, either way will  create an object with aditional _id(objectID)
                    id: data._id,
                    username: data.username,
                    faceurl: data.faceurl,          
                })
            ),
            User.findById(req.body.userBid).then(data=>
                new Object({
                    id: data._id,
                    username: data.username,
                    faceurl: data.faceurl,
                })
            )]);
        
        const [result1, result2]=await Promise.all([
            User.findByIdAndUpdate(req.body.userAid, {$push: {"friends":friendB}}, {safe: true, upsert: true}),
            User.findByIdAndUpdate(req.body.userBid, {$push: {"friends":friendA}}, {safe: true, upsert: true})
        ]);
        
        res.json("success");
    }catch(err){
        console.log(err);
    }
}


router.route('/users/addfriend').post(addfrient2eachother);

                
module.exports = router;
