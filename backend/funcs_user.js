const User=require("./models/user.js");


async function getUserUnreadforAllitsFriends(userId){
    const unread=new Map();
    await User.findById(userId).select("friends").then(data=> {
        console.log("how many friends:", data.friends.length);
        data.friends.forEach(friend=>{
            if(friend.UnreadMessageCount>0){
                unread.set(friend.username, friend.UnreadMessageCount);
            }
            
        });
        console.log("return unread",unread);
    }).catch(err=> console.log("getUserUnreadforAllitsFriends error due to:",err));
    return unread;
}

async function updateUserUnreadforAllitsFriends(userId, unread){
    
    await User.findById(userId).select("friends").then(data=>{
        data.friends.forEach(friend => {
            if(unread.has(friend.username)){
                friend.UnreadMessageCount = unread.get(friend.username);
            }
        });
        // User.findByIdAndUpdate(userId, { "friends": data.friends}, function (err, docs) {
        //     if (err){
        //         console.log(err);
        //     }
        //     else{
        //         console.log("Updated User : ", docs);
        //     }
        // });
        data.save();
    }).catch(err=>console.log(" updateUserUnreadforAllitsFriends fail due to:", err));
    
}


async function increase1unread(username, friendname){
  
    await User.findOne({"username":username}).select({friends: 1}).exec((err, data) =>{
        if(err){
            console.log("increase1unread fail", err);
        }else{
            console.log("friends----------:",data);
            data.friends.forEach(friend => {
                if(friend.username===friendname){
                    friend.UnreadMessageCount++;
                    console.log("friend.UnreadMessageCount:",friend.UnreadMessageCount);
                }
            });
            data.save().then(saved=> console.log("what saved:", saved));
        }        
    });
}
           

module.exports = {
    getUserUnreadforAllitsFriends,
    updateUserUnreadforAllitsFriends,
    increase1unread
};
    
