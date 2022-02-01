const express = require('express');
const  cors = require('cors');
const  mongoose = require('mongoose');

require('dotenv-flow').config();
require('dotenv').config();


const uri = process.env.ATLAS_URI;

const clientP=mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }
                              )
      .then((m) => m.connection.getClient())
      .catch(err=>console.log(err));

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})



const app = express();
app.use(express.json());

app.use(cors({
    ////// NOTE: after 8080, don't add a slash "/", or you'll run into cors error
    origin: ['http://localhost', 'http://localhost:8080'],
    credentials: true,
}));

app.use(express.static(__dirname + '/public'));
//////////////////////////////////////////////////////////////////////////////////////

const session= require("express-session");
const MongoStore=require("connect-mongo");

 app.use(session({
      name: process.env.SESS_NAME,
      secret: process.env.SESS_SECRET,
      saveUninitialized: false,
      resave: false,
     store: MongoStore.create({
         clientPromise: clientP,
         //mongoUrl: 'mongodb://bguo:bingpass@localhost:27017/test',
         //         mongoUrl: uri,
         collectionName: 'session'
         //When the session cookie has an expiration date, connect-mongo will use it. Otherwise, it will create a new one, using ttl option.
         //         ttl: parseInt(process.env.SESS_LIFETIME) / 1000
      }),
     cookie: {
         sameSite: false,
         maxAge: parseInt(process.env.SESS_LIFETIME)
     }
 }));


console.log("process.env.SESS_LIFETIME:"+process.env.SESS_LIFETIME);

//////////////////////////////////////////////////////////////////////////////////////

const userAPI = require('./routes/users.route.js');
const sessionAPI = require('./routes/session.route.js');
const chatAPI = require('./routes/chat.route.js');
app.use('/api', userAPI);
app.use('/session', sessionAPI);
app.use('/chat', chatAPI);

////////////////////////////////////////////////////////////////////////////////////// io 
const http = require('http');
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: ['http://localhost', 'http://localhost:8080'],
    methods: ["GET", "POST"]
  }
});

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
    socket.username = username;
    socket.faceurl = socket.handshake.auth.faceurl;
  next();
});

const activeUsers =new Map();

io.on("connection", function (socket) {
    console.log("Made socket connection");

    socket.emit("activeUsers", Object.fromEntries(activeUsers));
    
    socket.join(socket.username);
    console.log("socket.username:"+socket.username+"  userssize:"+activeUsers.size+"  list:"+activeUsers);
  
    if(!activeUsers.has(socket.username)) {
        console.log("push user:"+socket.username);
        activeUsers.set(socket.username, {faceurl: socket.faceurl});
        socket.broadcast.emit("user connected", {
            username: socket.username,
            faceurl: socket.faceurl,
        });
    }

    console.log("how many activeruser:"+activeUsers.size);
    
    // socket.on("private message", ({ content, to }) => {
    //     socket.to(to).to(socket.username).emit("private message", {
    //         content,
    //         from: socket.username,
    //         to,
    //     });
    // });

    socket.on("duo chat", ({ content,time, to }) => {
        console.log("received duo chat"+"  content:"+content+"  time:"+time+"  to:"+to);
        socket.to(to).to(socket.username).emit("duo chat", {
            content,
            time,
            from: socket.username,
        });
    });
    socket.on("friend request", ({ content, userid, to }) => {
        console.log("send friend request: faceurl:"+socket.faceurl);
        socket.to(to).emit("friend request", {
            content,
            userid,
            from: socket.username,
            faceurl: socket.faceurl,
        });
    });
    
    socket.on("friend added", ({  userid, faceurl, to }) => {
        socket.to(to).emit("friend added", {
            userid,
            faceurl,
            from: socket.username,
        });
    });
    socket.on("disconnect", async () => {
        console.log("there's a disconnect from:"+socket.username);
        const matchingSockets = await io.in(socket.username).allSockets();
        const isDisconnected = matchingSockets.size === 0;
        if (isDisconnected) {
            // notify other users
            console.log("going to remove this user");
            socket.broadcast.emit("user disconnected", socket.username);
            // update the connection status of the session
            activeUsers.delete(socket.username);
        }
        console.log("how many activeruser:"+activeUsers.size);
    });

  

    // socket.on("typing", function (data) {
    //     socket.broadcast.emit("typing", data);
    // });
    
});





/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

const port = process.env.PORT || 4000;
server.listen(port, () => {
    console.log('listening on *:'+port);
});

