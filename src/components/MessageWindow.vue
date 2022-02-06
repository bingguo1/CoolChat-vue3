<template>
  <div class="card card_message">
    <div class="card-header msg_head">
      <div class="d-flex bd-highlight">
        <div class="img_cont">
          <img
            :src="currentInterlocutor.faceurl"
            class="rounded-circle user_img"
          />
          <span
            class="online_icon"
            v-bind:class="{
              offline: selectedChatUsername
                ? !friendList.get(selectedChatUsername).online
                : true,
            }"
          ></span>
        </div>
        <div class="user_info">
          <span>Chat with {{ selectedChatUsername }}</span>
          <p>{{currentDialogue.length}} Messages</p>
        </div>
        <div class="video_cam">
          <span><i class="fas fa-video"></i></span>
          <span><i class="fas fa-phone"></i></span>
        </div>
      </div>
      <span id="action_menu_btn" @click="$refs.actionMenuModal.openModal()"
        ><i class="fas fa-ellipsis-v"></i
      ></span>

      <modal-base ref="actionMenuModal" class="click-menu" id="action-menu">
        <ul>
          <li><i class="fas fa-user-circle"></i> View profile</li>
          <li><i class="fas fa-users"></i> Add to close friends</li>
          <li><i class="fas fa-plus"></i> Add to group</li>
          <li><i class="fas fa-ban"></i> Block</li>
        </ul>
      </modal-base>
    </div>
    <div
      class="card-body msg_card_body"
      id="msg_main"
      ref="infiniteList"
      @scroll="scrollGetOldMessages"
    >
      <transition name="fade">
        <div class="loading" v-show="loadingOldMessages">
          <template v-if="stillHaveOldMessage">
            <span class="fa fa-spinner fa-spin"></span> Loading
          </template>
          <template v-else>
            End of History
          </template>
        </div>
      </transition>
      <template v-for="(message, index) in currentDialogue" :key="index">
        <div
          class="d-flex mb-4"
          v-bind:class="[
            message.isSelf ? 'justify-content-end' : 'justify-content-start',
          ]"
        >
          <template v-if="message.isSelf">
            <div class="msg_cotainer_send">
              {{ message.content }}
              <span class="msg_time_send">{{
                displayTime(new Date(message.time))
              }}</span>
            </div>
            <div class="img_cont_msg">
              <img :src="myfaceurl" class="rounded-circle user_img_msg" />
            </div>
          </template>
          <template v-else>
            <div class="img_cont_msg">
              <img
                :src="currentInterlocutor.faceurl"
                class="rounded-circle user_img_msg"
              />
            </div>
            <div class="msg_cotainer">
              {{ message.content }}
              <span class="msg_time">{{
                displayTime(new Date(message.time))
              }}</span>
            </div>
          </template>
        </div>
      </template>
    </div>
    <div class="card-footer">
      <div class="input-group">
        <span class="input-group-text attach_btn"
          ><i class="fas fa-paperclip"></i
        ></span>
        <textarea
          name=""
          id="inputarea"
          v-on:keyup.enter="sendMessage"
          class="form-control type_msg"
          v-model="messageInEdit"
          placeholder="Type your message..."
        ></textarea>
        <span class="input-group-text send_btn" @click="sendMessage"
          ><i class="fas fa-location-arrow"></i
        ></span>
      </div>
    </div>
  </div>
</template>

<script>
import socket from "../socket";
import ModalBase from "./ModalBase.vue";
const onePageMessages = 8;
export default {
  name: "MessageWindow",
  components: { ModalBase },
  props: {
    selectedChatUsername: String,
    friendList: Object,
    myfaceurl: String,
  },
  data() {
    return {
      recentChats: "",
      currentInterlocutor: "",
      currentDialogue: [],
      messageInEdit: "",
      loadingOldMessages: false,
      oldScrollHeight: -1,
      stillHaveOldMessage: true,
      // latestMessageForCurrentChatter:""
    };
  },
  created() {
    console.log("myusername:" + this.global.myusername);
    ///// check the last loggin user is same or not, if same, start to use localStorage, if not, delete localStorage
    if (
      window.localStorage.getItem("recentLoggedUsername") ===
      this.global.myusername
    ) {
      if (window.localStorage.getItem("recentChats")) {
        this.recentChats = new Map(
          JSON.parse(window.localStorage.getItem("recentChats"))
        );
      } else {
        this.recentChats = new Map();
      }
    } else {
      window.localStorage.setItem(
        "recentLoggedUsername",
        this.global.myusername
      );
      window.localStorage.setItem("recentChats", []);
      this.recentChats = new Map();
      console.log("this.recentChats is new map");
    }

    this.getAllUnreadMessages();

    window.addEventListener("beforeunload", this.doitBeforeTabClose);

    socket.on("duo chat", ({ content, time, from }) => {
      console.log("got new duo chat in message window");
      if (from === this.global.myusername) return;
      const oneMessage = {
        isSelf: false,
        content,
        time,
      };
       this.oldScrollHeight = this.$refs.infiniteList.scrollHeight;
      if (this.recentChats.has(from)) {
        this.recentChats.get(from).dialogue.push(oneMessage);
      } else {
        this.recentChats.set(from, {
          user: { faceurl: this.friendList.get(from).faceurl },
          dialogue: [oneMessage],
        });
        console.log("sent new chatter in duo chat socket on");
        this.emitter.emit("new chatter", from);
      }
      this.emitter.emit("new message", from);
      // this.latestMessageForCurrentChatter=content;
    });
  },
  mounted() {
  },
  updated() {
        if(this.oldScrollHeight==-1 || (this.$refs.infiniteList.scrollHeight-this.oldScrollHeight)<200){
           this.scrollToTheBottom();
        }else{
          this.$refs.infiniteList.scrollTop = this.$refs.infiniteList.scrollHeight - this.oldScrollHeight;
        }
  },
  unmounted() {
    socket.off("duo chat");
    this.doitBeforeTabClose();
  },
  methods: {
    throttle(func, wait) {
      let waiting = false;
      return function () {
        if (waiting) {
          return;
        }
        waiting = true;
        setTimeout(() => {
          func.apply(this, arguments);
          waiting = false;
        }, wait);
      };
    },

    throttle_later(func, wait) {
      let waiting = false;
      return function () {
        if (waiting) {
          return;
        }
        waiting = true;
        func.apply(this, arguments);
        setTimeout(() => {
          waiting = false;
        }, wait);
      };
    },
    testFunc(){
      this.throttle(this.showScrollTop, 300);
    },
    showScrollTop(){
        console.log("current scrolltop:",document.querySelector("#msg_main").scrollTop);
    },
    scrollToTheBottom() {
      document.querySelector("#msg_main").scrollTop =
        document.querySelector("#msg_main").scrollHeight;
    },

    scrollGetOldMessages() {
      if (this.$refs.infiniteList.scrollTop <= 0) {  
          this.stillHaveOldMessage=true;
          this.loadingOldMessages = true;
            this.oldScrollHeight = this.$refs.infiniteList.scrollHeight;
            this.getNPageOlderMessagesForCurrentChatter(2).then((res) => {
           if(res=="endofhistory"){
              this.stillHaveOldMessage=false;
              setTimeout(()=>this.loadingOldMessages = false, 500);
           } else{
               this.loadingOldMessages = false;
           }
          console.log("finish fetching old messages");
        });
      }
    },
    displayTime(time) {
      //           Same day:  7:45 PM/AM
      // Not same day but same week: Monday, 7:40 PM
      // Not same week, but same year: Jan 18, 7:45 PM
      // Not same year,  Dec 20, 2019, 7:20 PM

      const now = new Date();
      const sameDay =
        time.getFullYear() === now.getFullYear() &&
        time.getMonth() === now.getMonth() &&
        time.getDate() === now.getDate();
      const sameWeek =
        time.getDay() < now.getDay() && time - now < 7 * 24 * 60 * 60 * 1000;
      const sameYear = time.getFullYear() === now.getFullYear();

      if (sameDay) {
        return time.toLocaleTimeString(undefined, {
          hour: "numeric",
          minute: "numeric",
        });
      } else if (sameWeek) {
        return time.toLocaleTimeString(undefined, {
          weekday: "short",
          hour: "numeric",
          minute: "numeric",
        });
      } else if (sameYear) {
        return time.toLocaleTimeString(undefined, {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        });
      } else {
        return time.toLocaleTimeString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        });
      }
    },
    ///////// ctrl + enter will automatically add line break to textarea
    ///////// ctrl + enter will automatically add line break to textarea

    sendMessage() {
      this.messageInEdit = this.messageInEdit.trim();
      if (this.messageInEdit === "") return;
      const time = new Date();
      this.currentDialogue.push({
        isSelf: true,
        content: this.messageInEdit,
        time,
      });
      socket.emit("duo chat", {
        content: this.messageInEdit,
        time,
        to: this.selectedChatUsername,
      });
       this.oldScrollHeight = this.$refs.infiniteList.scrollHeight;
      // this.latestMessageForCurrentChatter=this.messageInEdit;
      this.messageInEdit = "";
      
      // console.log("------",[...this.recentChats.entries()]);
      // console.log("currentDialogue:", this.currentDialogue);
      //            console.log("height:"+document.querySelector("#msg_main").scrollHeight);
      //            console.log("height:"+this.$refs.msg_main.scrollHeight);
      //this.$refs.msg_main.scrollTop=this.$refs.msg_main.scrollHeight;
      // const height=document.querySelector("#msg_main").scrollHeight;
      // document.querySelector("#msg_main").scrollTop=height;
    },
    doitBeforeTabClose() {
      window.localStorage.setItem(
        "recentChats",
        JSON.stringify(Array.from(this.recentChats))
      );
    },

    getAllUnreadMessages() {
      const friend_nUnread_array = [];
      this.friendList.forEach((value, key) => {
        const nMsg = this.recentChats.has(key)
          ? this.recentChats.get(key).dialogue.length
          : 0;
        const laterThan =
          nMsg === 0
            ? new Date(0)
            : this.recentChats.get(key).dialogue[nMsg - 1].time;
        friend_nUnread_array.push({
          friendname: key,
          latestNMsg: Math.max(value.UnreadMessageCount + 1, onePageMessages),
          laterThan,
        });
      });
      console.log("friend_nUnread_array:", friend_nUnread_array);
      fetch("http://localhost:4000/msg/getAllUnreadMessages", {
        method: "POST",
        body: JSON.stringify({
          username: this.global.myusername,
          friend_nUnread_array,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((resp) => resp.json())
        .then((res) => {
          console.log("---->receive new messages: ", res);
          res.forEach(({ friendname, newMessages, nMostMessage }) => {
            let dialogue = [];
            if (this.recentChats.has(friendname)) {
              dialogue = this.recentChats.get(friendname).dialogue;
              if (newMessages.length == nMostMessage) {
                /// the messages saved in localStorage is away from the latest messages,
                ////the user possibily used his/her other devices recently, so clear the old unconnected messages
                console.log(
                  "clean old distant messages for friendname:",
                  friendname
                );
                dialogue.length = 0;
              }
            } else {
              this.recentChats.set(friendname, {
                user: { faceurl: this.friendList.get(friendname).faceurl },
                dialogue: dialogue,
              });
              console.log("sent new chatter in getAllUnreadMessages");
              this.emitter.emit("new chatter", friendname);
            }
            newMessages.reverse().forEach((msg) => {
              dialogue.push({
                isSelf: msg.from === this.global.myusername,
                content: msg.content,
                contentType: msg.contentType,
                time: msg.createdAt,
              });
            });
          });          
        });
    },
    getNPageOlderMessagesForCurrentChatter(nPage) {
      console.log("get N page old messages");
      const currentOldestMessageTime =
        this.currentDialogue.length === 0
          ? new Date()
          : this.currentDialogue[0].time;
      return fetch(
        "http://localhost:4000/msg/getNEarlierMessagesForOneFriend",
        {
          method: "POST",
          body: JSON.stringify({
            username: this.global.myusername,
            friendname: this.selectedChatUsername,
            nMessage: onePageMessages * nPage,
            earlierThan: currentOldestMessageTime,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((resp) => resp.json())
        .then((newMessages) => {
          if (newMessages.length === 0) {
            return "endofhistory";
          }
          newMessages.forEach((msg) => {
            this.currentDialogue.unshift({
              isSelf: msg.from === this.global.myusername,
              content: msg.content,
              contentType: msg.contentType,
              time: msg.createdAt,
            });
          });
          return "success";
        });
    },
  },
  watch: {
    selectedChatUsername(val) {
      if (this.recentChats.has(val)) {
        this.currentInterlocutor = this.recentChats.get(val).user;
        this.currentDialogue = this.recentChats.get(val).dialogue;
      //  if(this.currentDialogue.length>1) this.latestMessageForCurrentChatter=this.currentDialogue[this.currentDialogue.length-1].content;
      } else {
        console.log("create new diaglogue in messagewindow");
        this.currentDialogue = [];
        this.currentInterlocutor = {
          faceurl: this.friendList.get(val).faceurl,
        };
        this.recentChats.set(val, {
          user: this.currentInterlocutor,
          dialogue: this.currentDialogue,
        });
      }
    },
  },
};
</script>
<style>
.loading {
  text-align: center;
  position: absolute;
  color: #fff;
  z-index: 9;
  background: rgba(0, 0, 0, 0.4);
  padding: 8px 18px;
  border-radius: 5px;
  left: 50%;
  top: 86px;
  transform: translate(-50%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.video_cam {
  margin-left: 50px;
  margin-top: 5px;
}
.video_cam span {
  color: white;
  font-size: 20px;
  cursor: pointer;
  margin-right: 20px;
}

.user_img_msg {
  height: 40px;
  width: 40px;
  border: 1.5px solid #f5f6fa;
}

.img_cont_msg {
  height: 40px;
  width: 40px;
}

.msg_cotainer {
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 10px;
  border-radius: 25px;
  background-color: #82ccdd;
  padding: 10px;
  position: relative;
}
.msg_cotainer_send {
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 10px;
  border-radius: 25px;
  background-color: #78e08f;
  padding: 10px;
  position: relative;
}
.msg_time {
  position: absolute;
  left: 0;
  bottom: -15px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 10px;
  width: 120px;
  text-align: left;
}
.msg_time_send {
  position: absolute;
  right: 0;
  width: 120px;
  text-align: right;
  bottom: -15px;
  color: rgba(255, 255, 255, 0.5);
  /* border: 1px yellow solid; */
  font-size: 10px;
}
.msg_head {
  position: relative;
}

.msg_cotainer_send,
.msg_cotainer {
  max-width: 70%;
}

#action-menu .modal__dialog {
  top: 60px;
  right: 210px;
}

.card_message {
  background-color: rgba(0, 0, 0, 0.4) !important;
}

#action_menu_btn {
  position: absolute;
  right: 10px;
  top: 10px;
  color: white;
  cursor: pointer;
  font-size: 20px;
}
</style>
