<template>
<!-- <p>Taherah left 7 mins ago</p> -->
<!-- <p>Kalid is online</p> -->
<!-- <span class="online_icon offline"></span> -->
<div>
    <ul class="contacts">
        <template v-for="(chatter,index) in recentChatterList" :key="index">
            <li v-bind:class="{active:  chatter.username===selectedChatUsername}" @click="updateSelectedChatter(chatter.username)">
                <div class="d-flex bd-highlight">
                    <div class="img_cont">
                        <img :src="chatter.faceurl" class="rounded-circle user_img">
                        <span class="online_icon" v-bind:class="{offline: !chatter.online}"></span>
                    </div>
                    <div class="user_info">
                        <span>{{chatter.username}}</span>
                        <p v-if="chatter.online">{{chatter.username}} is online</p>
                        <p v-else>{{chatter.username}} left {{chatter.lefttime}} ago</p>
                    </div>
                </div>
            </li>
        </template>
    </ul>
</div>

</template>

<script>
export default {
    name: 'RecentChatList',
    props:{
        selectedChatUsername: String,
        friendList: Object,
        activeUserList: Object,
        
    },
    data(){
        return{ 
            recentChatterList: [],
            
        }
    },
    created(){    
        if(!window.localStorage.getItem("recentChats")) return;
        
        //        if(!window.localStorage.getItem("recentChats") || window.localStorage.getItem("recentChats").length==0) return;
        JSON.parse(window.localStorage.getItem("recentChats")).forEach( userinfo_dialogue=> {
            console.log(" add username:"+userinfo_dialogue[0]);
            console.log("url:"+userinfo_dialogue[1].user.faceurl);
            this.recentChatterList.push({
                username: userinfo_dialogue[0],
                faceurl: userinfo_dialogue[1].user.faceurl,
                ////// activelist won't be filled before this action, so have to watch activelist 
                online: false,
                lefttime: "7 mins",
            });
        });
        
        this.emitter.on('new chatter', (username) => {
             this.recentChatterList.push({
                 username,
                 faceurl: this.friendList.get(username).faceurl,
                 online: true,
                 lefttime: "",                 
             });
        });

    },
    mounted(){            
    },
    methods:{
        updateSelectedChatter(username){
            this.$emit("update:selectedChatUsername",username);
        }
    },
    watch:{
        selectedChatUsername(val){
            console.log("selectedChatUsername value changed");
                if(!this.recentChatterList.find( user=> user.username===val)){
                    console.log("no chat history, adding chatter");
                    this.recentChatterList.push({
                        username: val,
                        faceurl: this.friendList.get(val).faceurl,
                        online: this.activeUserList.has(val),
                        lefttime: "7 mins",
                    });
                }
        },
        activeUserList:{
            handler(val){
                this.recentChatterList.forEach( user=>{
                    if(val.has(user.username)){
                        user.online=true;
                    }else{
                        user.online=false;
                    }
                });
            },
            deep: true
        }
        
    },
    
}
</script>

    <style>

</style>
