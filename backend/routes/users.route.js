const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');



let User = require('../models/user.js');


router.route('/users').get((req, res, next) => {
    User.find((error, data) => {
        if (error) {
            return next(error)
        } else {
            console.log("find data successfully and sending them as json");
            res.json(data)
        }
    })    
});
router.route('/users/:id').get((req, res, next) => {
    User.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })

});


async function createNewUser(req, res, next){
    const username = req.body.username;
    const email=req.body.email;
    const faceurl=req.body.faceurl;
    
    // User.findOne({'username': username}, function (err, docs) {
    //     if (err){
    //         console.log(err);
    //     }
    //     else{
    //         console.log("Result : ", docs);
    //         if(docs) {
    //             res.json("User exists");                
    //             console.log("User exists");
    //             return next();
    //         }
    //     }
    // });
    // User.findOne({'email': email}, function (err, docs) {
    //     if (err){
    //         console.log(err);
    //     }
    //     else{
    //         console.log("Result : ", docs);
    //         if(docs) {
    //             res.json("Email exists");                
    //             console.log("Email exists");
    //             return next();
    //         }
    //     }
    // });
    

    try{
        const haveUser=await User.findOne({'username': username});
        if(haveUser){
            res.json("User already exists!");                
            console.log("User exists");
            return next();
        }
        const haveEmail=await User.findOne({'email': email});
        if(haveEmail){
            res.json("Email already exists!");                
            console.log("Email exists");
            return next();
        }
        console.log("try to add this user");
        const salt= await bcrypt.genSalt(10);
        const hash= await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            username,
            email,
            password: hash,
            faceurl,
        });
        await newUser.save();
        res.json('success');        
    }catch(err){
        console.log(err);
    }
}

///// way 1:
router.route('/users/create').post(createNewUser);
///// way 2:
// router.route('/users/create').post((req, res, next) => {
    
    // const username = req.body.username;
    // const email=req.body.email;
    // bcrypt.genSalt(10).then(
    //     (salt) => {
    //         console.log("salt:"+salt);
    //         bcrypt.hash(req.body.password, salt).then(
    //             (hash) => {
    //                 console.log("hash:"+hash);
    //                 const newUser = new User({
    //                     username,
    //                     email,
    //                     password: hash
    //                 });
    //                 newUser.save()
    //                     .then(() => res.json('User added!'))
    //                     .catch(err => res.status(400).json('Error: ' + err));
    //             }
    //         ).catch(err=> console.log(err));
    //     }
    // ).catch(err=> console.log(err));       

//});

router.route('/users/:id').put((req, res, next) => {

    const query={ _id: req.params.id};
    const update = {
        username:  req.body.username,
        email: req.body.email,
        password: req.body.password
    };                     
    User.findOneAndUpdate(query, update, {upsert: true}, function(err, doc) {
        if (err) return res.send(500, {error: err});
        return res.json('Succesfully saved.');
    });
    
});

router.route('/users/:id').delete((req, res, next) => {
    User.findByIdAndDelete(req.params.id)
        .then(() => res.json('User deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
    
});
module.exports = router;
