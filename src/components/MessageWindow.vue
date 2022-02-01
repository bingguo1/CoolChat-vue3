<template>
    <div class="card card_message">
                <div class="card-header msg_head">
                    <div class="d-flex bd-highlight">
                        <div class="img_cont">
                            <img :src="currentInterlocutor.faceurl" class="rounded-circle user_img">
                            <span class="online_icon"></span>
                        </div>
                        <div class="user_info">
                            <span>Chat with {{selectedChatUsername}}</span>
                            <p>1767 Messages</p>
                        </div>
                        <div class="video_cam">
                            <span><i class="fas fa-video"></i></span>
                            <span><i class="fas fa-phone"></i></span>
                        </div>
                    </div>
                    <span id="action_menu_btn" ref="action_menu_btn" @click="show_action_menu=!show_action_menu"><i class="fas fa-ellipsis-v"></i></span>
                    <div v-show="show_action_menu" class="action_menu" ref="action_menu">
                        <ul>
                            <li><i class="fas fa-user-circle"></i> View profile</li>
                            <li><i class="fas fa-users"></i> Add to close friends</li>
                            <li><i class="fas fa-plus"></i> Add to group</li>
                            <li><i class="fas fa-ban"></i> Block</li>
                        </ul>
                    </div>
                </div>
                <div class="card-body msg_card_body" id="msg_main">
                    <template v-for="(message, index) in currentDialogue"  :key="index">
                        <div class="d-flex mb-4" v-bind:class="[message.isSelf? 'justify-content-end':'justify-content-start']">
                            <template v-if="message.isSelf">
                                <div class="msg_cotainer_send">
                                    {{message.content}}
    <span class="msg_time_send">{{displayTime(new Date(message.time))}}</span>
                                </div>
                                <div class="img_cont_msg">
                                    <img :src="myfaceurl" class="rounded-circle user_img_msg">
                                </div>                                
                            </template>
                            <template v-else>
                                <div class="img_cont_msg">
                                    <img :src="currentInterlocutor.faceurl" class="rounded-circle user_img_msg">
                                </div>
                                <div class="msg_cotainer">
                                    {{message.content}}
    <span class="msg_time">{{displayTime(new Date(message.time))}}</span>
                                </div>
                            </template>                      
                        </div>
                    </template>                                  
                </div>
                <div class="card-footer">
                    <div class="input-group">
                        <span class="input-group-text attach_btn"><i class="fas fa-paperclip" ></i></span>
                        <textarea name="" id="inputarea" v-on:keyup.enter="sendMessage"  class="form-control type_msg" v-model="messageInEdit" placeholder="Type your message..."></textarea>
                        <span class="input-group-text send_btn" @click="sendMessage"><i class="fas fa-location-arrow"></i></span>
                    </div>
                </div>
    </div>
</template>

<script>
    import socket from "../socket";
export default{
    name:"MessageWindow",
    props:{
        selectedChatUsername: String,
        friendList: Object,
        myfaceurl: String,
        myusername: String,
    },
    data(){
        return{
            recentChats:"",
            currentInterlocutor: "",
            currentDialogue: [],
            messageInEdit:"",
            show_action_menu: false,
        }
    },
    created(){
        console.log("myusername:"+this.myusername);
        ///// check the last loggin user is same or not, if same, start to use localStorage, if not, delete localStorage
        if(window.localStorage.getItem("recentLoggedUsername")===this.myusername)
            this.recentChats=new Map(JSON.parse(window.localStorage.getItem("recentChats")));
        else{
            window.localStorage.setItem("recentLoggedUsername", this.myusername);
            window.localStorage.setItem("recentChats",[]);
            this.recentChats=new Map();
            console.log("this.recentChats is new map");
        }

        
        window.addEventListener('beforeunload', this.doitBeforeTabClose);

        socket.on("duo chat", ({content, time, from})=>{
            console.log("got new duo chat in message window");
            if(from===this.$myusername) return;
            const oneMessage={
                isSelf: false,
                content,
                time
            };
            if(this.recentChats.has(from)){
                this.recentChats.get(from).dialogue.push(oneMessage);               
            }else{
                
                this.recentChats.set(from, {
                    user: { faceurl: this.friendList.get(from).faceurl },
                    dialogue: [oneMessage],
                });
                
                this.emitter.emit('new chatter', from);
            }
        });
   
    },
    mounted(){     
        window.addEventListener('mousedown', this.action_menu_disappear);        
    },
    unmounted(){
        window.removeEventListener('mousedown', this.action_menu_disappear);
        this.doitBeforeTabClose();
    },
    updated(){
        document.querySelector("#msg_main").scrollTop=document.querySelector("#msg_main").scrollHeight;
    },
    methods:{
        displayTime(time){
  //           Same day:  7:45 PM/AM
// Not same day but same week: Monday, 7:40 PM
// Not same week, but same year: Jan 18, 7:45 PM
// Not same year,  Dec 20, 2019, 7:20 PM
           
            const now=new Date();
            const sameDay= (time.getFullYear()===now.getFullYear() && time.getMonth()===now.getMonth() && time.getDate()===now.getDate());
            const sameWeek= (time.getDay()< now.getDay() && (time-now)<7*24*60*60*1000);
            const sameYear=(time.getFullYear()===now.getFullYear());
            if(sameDay){
                return time.toLocaleTimeString(undefined, {hour:"numeric", minute:"numeric"});
            }else if(sameWeek){
                return time.toLocaleTimeString(undefined, {weekday:"short", hour:"numeric", minute:"numeric"});
            }else if(sameYear){
                return time.toLocaleTimeString(undefined, { month: 'short', day: 'numeric', hour:"numeric", minute:"numeric"});
            }else{
                return time.toLocaleTimeString(undefined, { year:'numeric', month: 'short', day: 'numeric', hour:"numeric", minute:"numeric"});
            }            

        },
        ///////// ctrl + enter will automatically add line break to textarea
        ///////// ctrl + enter will automatically add line break to textarea      
        
        sendMessage(){
            this.messageInEdit=this.messageInEdit.trim();
            if(this.messageInEdit==="") return;
            const time=new Date();
            this.currentDialogue.push({
                isSelf: true,
                content: this.messageInEdit,
                time
            });
            socket.emit("duo chat", {
                content: this.messageInEdit,
                time,
                to: this.selectedChatUsername,
            });
            this.messageInEdit="";
            // console.log("------",[...this.recentChats.entries()]);
            // console.log("currentDialogue:", this.currentDialogue);
            //            console.log("height:"+document.querySelector("#msg_main").scrollHeight);
            //            console.log("height:"+this.$refs.msg_main.scrollHeight);
            //this.$refs.msg_main.scrollTop=this.$refs.msg_main.scrollHeight;
            // const height=document.querySelector("#msg_main").scrollHeight;
            // document.querySelector("#msg_main").scrollTop=height;
        },
        doitBeforeTabClose(){
            window.localStorage.setItem("recentChats",JSON.stringify(Array.from(this.recentChats)));
        },
        action_menu_disappear(e){
            if(!this.show_action_menu) return;
            if(!this.$refs.action_menu.contains(e.target)  && !this.$refs.action_menu_btn.contains(e.target)){
                this.show_action_menu=false;
            }
        }
        
    },
    watch:{
        selectedChatUsername(val){        
            if(this.recentChats.has(val)){
                this.currentInterlocutor=this.recentChats.get(val).user;
                this.currentDialogue=this.recentChats.get(val).dialogue;
            }else{
                console.log("create new diaglogue in messagewindow");
                this.currentDialogue=[];
                this.currentInterlocutor={faceurl: this.friendList.get(val).faceurl};
                this.recentChats.set(val,{
                    user: this.currentInterlocutor,
                    dialogue: this.currentDialogue,
                });
                
            }
        }
    },
}
</script>
<style>
    .one-msg{
    max-width: 70%;
}
    .msg_head .action_menu{
        top: 30px;
        right: 15px;
    }

    .card_message{
         background-color: rgba(0,0,0,0.4) !important;
    }
</style>
