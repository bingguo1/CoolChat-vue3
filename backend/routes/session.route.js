const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const sessionizeUser = user => {
  return { userId: user.id, username: user.username };
}

let User = require('../models/user.js');

router.route('/login').post((req, res, next) =>{

    //res.setHeader('Access-Control-Allow-Credentials', 'true')
    
    User.find({ username: req.body.username}, function (err, docs){
        if (err){
            console.log('err:'+err);
        }else{
            if(docs.length==0){
                res.json(["username doesn't exist"]);
            }else{
                bcrypt.compare(req.body.password, docs[0].password , function(err, isMatch) {
                    if (err) {
                        console.log("err:"+err);
                    } else if (!isMatch) {
                        res.json(["Password doesn't match!"]);
                    } else {
                        req.session.user = {userid: docs[0]._id, username: docs[0].username};
                        //res.send(req.session.user);
                        res.json(["success", docs[0]._id]);
                    }
                })
            }

        }
    });
});

router.route('/logout').delete( (req, res) => {
    try {
        console.log("start to work on logout");
        const  user = req.session.user;
        if (user) {
            //req.session.destroy only destroy it on server side
            req.session.destroy((err) => { 
                if (err) console.log("err-->"+err);
                res.clearCookie(process.env.SESS_NAME);
                // res.send(user);
                console.log("destroyed");
                res.json("session destroyed");
            });
        } else {
            res.json("user already logged out");
        }
    } catch (err) {
        //    res.status(422).send(parseError(err));
        console.log("errcome:"+err);
        res.json(err);
    }
});

router.route('/justcheck').get( (req, res) => {
    const  user = req.session.user;
    if(user) {
        console.log("get user!");
        res.json(user);
    }
    else
        res.json("NoGoodSession");

});


module.exports = router;
