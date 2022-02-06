<template>
  <!-- <p>Taherah left 7 mins ago</p> -->
  <!-- <p>Kalid is online</p> -->
  <!-- <span class="online_icon offline"></span> -->
  <div>
    <ul class="contacts">
      <template v-for="(chatter, index) in recentChatterList" :key="index">
        <li
          v-bind:class="{ active: chatter.username === selectedChatUsername }"
          @click="updateSelectedChatter(chatter.username)"
        >
          <div class="d-flex bd-highlight">
            <div class="img_cont">
              <img :src="chatter.faceurl" class="rounded-circle user_img" />
              <span
                class="online_icon"
                v-bind:class="{ offline: !chatter.online }"
              ></span>
            </div>
            <div class="user_info">
              <span>{{ chatter.username }}</span>
              <p v-if="chatter.online">{{ chatter.username }} is online</p>
              <p v-else>
                {{ chatter.username }} left {{ chatter.lefttime }} ago
              </p>
            </div>
            <div class="unRead" v-if="chatter.nUnread > 0">
              <span
                class="UnReadCount"
                :style="{
                  padding:
                    calc_unReadMessage_alert_paddingSize(chatter.nUnread) +
                    'px',
                }"
                >{{ chatter.nUnread }}</span
              >
            </div>
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
const a = -15.0;
const b = -0.1;
const c = 15.0;
import socket from "../socket";
export default {
  name: "RecentChatList",
  props: {
    selectedChatUsername: String,
    friendList: Object, 
    // activeUserList: Object,
  },
  data() {
    return {
      recentChatterList: [],
    };
  },
  created() {
    console.log("global.username:", this.global.myusername);
    if (
      window.localStorage.getItem("recentLoggedUsername") === this.global.myusername
    ) {
      console.log("start to load chatterlist from local storage");
      if (window.localStorage.getItem("recentChats")) {
        //        if(!window.localStorage.getItem("recentChats") || window.localStorage.getItem("recentChats").length==0) return;
        JSON.parse(window.localStorage.getItem("recentChats")).forEach(
          (userinfo_dialogue) => {
            console.log(" add username:" + userinfo_dialogue[0]);
            console.log("url:" + userinfo_dialogue[1].user.faceurl);
            this.recentChatterList.push({
              username: userinfo_dialogue[0],
              faceurl: userinfo_dialogue[1].user.faceurl,
              ////// activelist won't be filled before this action, so have to watch activelist
              online: false,
              lefttime: "7 mins",
              nUnread: this.friendList.get(userinfo_dialogue[0])
                .UnreadMessageCount,
            });
          }
        );
      }
    }

    this.emitter.on("new chatter", (username) => {
      console.log("received new chatter");
      this.recentChatterList.push({
        username,
        faceurl: this.friendList.get(username).faceurl,
        online: true,
        lefttime: "5 mins",
        nUnread: this.friendList.get(username).UnreadMessageCount,
      });
      console.log("new chatter list", this.recentChatterList);
    });

    this.emitter.on("new message", (username) => {
      console.log("received new message, will decide to ++ or not");
      if (!document.hasFocus() || this.selectedChatUsername != username) {
        const index = this.recentChatterList.findIndex(
          (user) => user.username === username
        );
        this.recentChatterList[index].nUnread++;
      }
    });
  },
  mounted() {
    window.addEventListener("focus", this.focusOnCurrentChatter);
  },
  unmounted() {
    window.removeEventListener("focus", this.focusOnCurrentChatter);
    this.emitter.all.clear();
  },
  methods: {
    updateSelectedChatter(username) {
      this.$emit("update:selectedChatUsername", username);
    },
    focusOnCurrentChatter() {
      if(!this.selectedChatUsername) return;
      const index = this.recentChatterList.findIndex(
        (user) => user.username === this.selectedChatUsername
      );
      if (this.recentChatterList[index].nUnread > 0) {
        this.recentChatterList[index].nUnread = 0;
        socket.emit("messages read", this.selectedChatUsername);
      }
    },
    calc_unReadMessage_alert_paddingSize(count) {
      console.log("padding size:", a * Math.exp(b * count) + c);
      return a * Math.exp(b * count) + c;
    },
  },
  watch: {
    selectedChatUsername(val) {
      console.log("selectedChatUsername value changed", val);
      if (!this.recentChatterList.find((user) => user.username === val)) {
        console.log("no chat history, adding chatter");
        this.recentChatterList.push({
          username: val,
          faceurl: this.friendList.get(val).faceurl,
          // online: this.activeUserList.has(val),
          online: this.friendList.get(val).online,
          lefttime: "10 mins",
          nUnread: this.friendList.get(val).UnreadMessageCount,
        });
      }
      const index = this.recentChatterList.findIndex(
        (user) => user.username === val
      );
      this.recentChatterList[index].nUnread = 0;
      socket.emit("messages read", val);
    },
    // activeUserList: {
    //   handler(val) {
    //     this.recentChatterList.forEach((user) => {
    //       if (val.has(user.username)) {
    //         user.online = true;
    //       } else {
    //         user.online = false;
    //       }
    //     });
    //   },
    //   deep: true,
    // },
    friendList: {
      handler(val) {
        this.recentChatterList.forEach((user) => {
          user.online = val.get(user.username).online;
        });
      },
      deep: true,
    },
  },
};
</script>

<style>
.user_img {
  height: 70px;
  width: 70px;
  border: 1.5px solid #f5f6fa;
}
.img_cont {
  position: relative;
  height: 70px;
  width: 70px;
}
.unRead {
  margin-left: auto;
  margin-top: 10px;
}
.UnReadCount {
  border: 3px solid rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  /* padding: 5px; */
  color: white;
  background-color: #cc0000;
}
</style>
