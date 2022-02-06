const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');


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

/////// this functino will initialize a user when he/she logs in 
router.route('/users/:id').get((req, res, next) => {
    User.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })

});

async function createNewUser(username, email, faceurl, password){
 
        const haveUser=await User.findOne({'username': username});
        if(haveUser){
            console.log("User exists");
            return "User already exists!";      
        }
        const haveEmail=await User.findOne({'email': email});
        if(haveEmail){
           
            console.log("Email exists");
            return "Email already exists!";    
         
        }
        console.log("try to add this user");
        const salt= await bcrypt.genSalt(10);
        const hash= await bcrypt.hash(password, salt);
        const newUser = new User({
            username,
            email,
            password: hash,
            faceurl,
        });
        await newUser.save();
        return 'success';
}

///// way 1:
//router.route('/users/create').post(createNewUser);
router.route('/users/create').post((req, res)=>{
    const username = req.body.username;
    const email=req.body.email;
    const faceurl=req.body.faceurl;
    const password=req.body.password;
    createNewUser(username, email, faceurl, password).then( result=>{
        res.json(result);
    }).catch(err => {
        console.log(" err=>",err);
        res.json("something wrong in server");
    });
});

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

router.route("/faker/addNUser/:nuser").get((req, res)=>{
    const nUser=req.params.nuser;
    var username, email;
    const faceurl="http://localhost:4000/imgs/defaulticon.png";
    const pass="pass";
    let result=" result:";
    for(let i=0;i<nUser;i++){
        username=faker.internet.userName();
        email=faker.internet.email();
        createNewUser(username, email, faceurl, pass).then(x=> result+=x);   
    }
    res.json(result);

});
module.exports = router;
