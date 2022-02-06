<template>
  <div class="row justify-content-center h-100" v-if="!loading">
    <div class="col-md-4 col-xl-3 chat">
      <div class="card mb-sm-3 mb-md-0 contacts_card">
        <div class="card-header">
          <div class="input-group">
            <span @click="$refs.profileMenuModal.openModal()"
              ><i class="fas fa-user-circle userIcon"></i
            ></span>
            <input
              type="text"
              placeholder="Search..."
              name=""
              class="form-control search"
            />
            <span class="input-group-text search_btn"
              ><i class="fas fa-search"></i
            ></span>
          </div>

          <modal-base
            ref="profileMenuModal"
            class="click-menu"
            id="profile-menu"
          >
            <ul>
              <li>{{newUserName}}</li>
              <li @click="logout">
                <i class="fas fa-sign-out-alt"></i> Log out
              </li>
              <li><i class="fas fa-address-card"></i> Check Profile</li>
            </ul>
          </modal-base>
        </div>
        <!-- card-body is a bootstrap class -->
        <div class="card-body left-body">
          <recent-chat-list
            v-show="tabShowing === 'recentChatTab'"
            :friendList="friendList"
            :activeUserList="activeUserList"
            v-model:selectedChatUsername="selectedChatUsername"
          >
          </recent-chat-list>
          <people-list
            v-show="tabShowing === 'peopleListTab'"
            :friendList="friendList"
            :activeUserList="activeUserList"
            :requestList="requestList"
            @changeSelectedPeopleNow="changeSelectedPeopleNow"
          ></people-list>
          <item-list v-show="tabShowing === 'itemListTab'"> </item-list>
        </div>

        <div class="left-card-footer">
          <div
            v-on:click="tabShowing = 'recentChatTab'"
            class="tab"
            :selected-chat-username="selectedChatUsername"
          >
            <i class="fas fa-comments tabicon"></i>
          </div>
          <div v-on:click="tabShowing = 'peopleListTab'" class="tab">
            <i class="fas fa-users tabicon"></i>
          </div>
          <div v-on:click="tabShowing = 'itemListTab'" class="tab">
            <i class="fas fa-th tabicon"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-8 col-xl-6 chat">
      <people-info-window
        v-show="tabShowing === 'peopleListTab'"
        :PeopleWindowParas="PeopleWindowParas"
        @chatNow="chatNow"
        @sendAFriendRequestNow="sendAFriendRequestNow"
        @addFriendNow="addFriendNow"
      >
      </people-info-window>
      <item-info-window v-show="tabShowing === 'itemListTab'">
      </item-info-window>
      <empty-message-window
        v-if="tabShowing === 'recentChatTab' && selectedChatUsername === null"
      >
      </empty-message-window>
      <message-window
        v-show="tabShowing === 'recentChatTab' && selectedChatUsername != null"
        :myfaceurl="user.faceurl"
        :friendList="friendList"
        :selectedChatUsername="selectedChatUsername"
      >
      </message-window>

      <test-window v-if="showTestWindow"> </test-window>
    </div>
  </div>
</template>

<script>
import RecentChatList from "./RecentChatList.vue";
import PeopleList from "./PeopleList.vue";
import ItemList from "./ItemList.vue";
import ItemInfoWindow from "./ItemInfoWindow.vue";
import PeopleInfoWindow from "./PeopleInfoWindow.vue";
import MessageWindow from "./MessageWindow.vue";
import EmptyMessageWindow from "./EmptyMessageWindow.vue";
import ModalBase from "./ModalBase.vue";
import TestWindow from "./TestWindow.vue";
import socket from "../socket";
export default {
  name: "chat",
  props: ["newUserName", "newUserID"],
  components: {
    RecentChatList,
    MessageWindow,
    PeopleList,
    ItemList,
    PeopleInfoWindow,
    ItemInfoWindow,
    EmptyMessageWindow,
    ModalBase,
    TestWindow,
  },
  data() {
    return {
      user: {
        username: this.newUserName,
        userid: this.newUserID,
        faceurl: "",
      },
      tabShowing: "recentChatTab",

      recentChats: [],

      //////////
      friendList: new Map(),
      activeUserList: new Map(),
      requestList: new Map(),
      //////

      PeopleWindowParas: {
        selectedMode: "",
        selectedUser: "",
        requestMessages: {},
      },

      selectedChatUsername: null,

      showTestWindow: false,
      loading: true,
    };
  },
  created() {
    console.log(
      "------------------------------------------------------------- create() from chat.vue"
    );
    this.global.myusername=this.user.username;
    this.initialize();

    // console.log("faceurl sent to socket:"+this.user.faceurl);
    // socket.auth = { "username":this.user.username, "faceurl": this.user.faceurl};
    // socket.connect();

    socket.on("activeUsers", (activeUsers) => {
      Object.entries(activeUsers).forEach(([key, value]) => {
        if (key != this.user.username) this.activeUserList.set(key, value);
      });
      console.log("receive activeUsers length:" + this.activeUserList.size);
      
      this.friendList.forEach( (value,key)=>{
        if(this.activeUserList.has(key)){
          value.online=true;
        }
      });
    });

    socket.on("user connected", (user) => {
      this.activeUserList.set(user.username, { faceurl: user.faceurl });
      console.log("add new user:" + user.username);
       if(this.friendList.has(user.username))
          this.friendList.get(user.username).online=true;
    });
    socket.on("user disconnected", (username) => {
      console.log("will remove:" + username);
      console.log("before remove length:" + this.activeUserList.size);
      this.activeUserList.delete(username);
      console.log("after remove length:" + this.activeUserList.length);
      if(this.friendList.has(username))
          this.friendList.get(username).online=false;
    });
    socket.on("friend request", ({ content, userid, from, faceurl }) => {
      console.log("get a friend request,from:" + from + "  faceurl:" + faceurl);
      this.requestList.set(from, { faceurl: faceurl, userid: userid });
      if (this.PeopleWindowParas.requestMessages[from]) {
        // console.log("content now:"+this.PeopleWindowParas.requestMessages.get(from));
        // console.log(typeof this.PeopleWindowParas.requestMessages.get(from));
        //this.PeopleWindowParas.requestMessages.set(from, this.PeopleWindowParas.requestMessages.get(from).push(content));
        this.PeopleWindowParas.requestMessages[from].push(content);
      } else {
        // this.PeopleWindowParas.requestMessages.set(from, new Array(content));
        this.PeopleWindowParas.requestMessages[from] = [content];
        console.log("new content:" + content);
        // console.log("check it:"+this.PeopleWindowParas.requestMessages.get(from));
      }
    });

    socket.on("friend added", ({ userid, faceurl, from }) => {
      //                this.friendList.push(friend);
      const status=this.activeUserList.has(from);
      this.friendList.set(from, {
        id: userid,
        faceurl,
        UnreadMessageCount: 0,
        online: status
      });
      
    });
  },
  mounted() {
    console.log("mounted from chat.vue");
  },
  unmounted() {
    socket.off("connect");
    socket.off("disconnect");
    socket.off("activeUsers");
    socket.off("user connected");
    socket.off("user disconnected");
    socket.off("private message");
    socket.off("friend request");
    socket.off("friend added");
    socket.disconnect();
  },
  methods: {
    logout() {
      fetch("http://localhost:4000/session/logout", {
        method: "DELETE",
        credentials: "include",
      })
        .then((resp) => resp.json())
        .then((resp) => {
          console.log(resp);
          this.$emit("logoutNow");
        });
    },
    justCheck() {
      fetch("http://localhost:4000/session/justcheck", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((resp) => resp.json())
        .then((resp) => console.log(resp));
    },

    closeModalMenu(event) {
      if (!event.target.closest(".action_menu")) {
        this.show_profile_menu = false;
      }
    },
    changeSelectedPeopleNow(selectedMode, selectedUser) {
      this.PeopleWindowParas.selectedMode = selectedMode;
      this.PeopleWindowParas.selectedUser = selectedUser;
      console.log(
        "changeSelectedPeopleNow:" + this.PeopleWindowParas.selectedUser
      );
    },
    sendAFriendRequestNow() {
      socket.emit("friend request", {
        content: "could u add me as a friend",
        userid: this.user.userid,
        to: this.PeopleWindowParas.selectedUser,
      });
    },
    addFriendNow() {
      /// add to friendList
      const username = this.PeopleWindowParas.selectedUser;
      const status=this.activeUserList.has(username);
      const friend = {
        userid: this.requestList.get(username).userid,
        faceurl: this.requestList.get(username).faceurl,
        UnreadMessageCount: 0,
        online: status
      };
      this.friendList.set(username, friend);
      /// update database
      fetch("http://localhost:4000/chat/users/addfriend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userAid: this.requestList.get(this.PeopleWindowParas.selectedUser)
            .userid,
          userBid: this.user.userid,
        }),
      })
        .then((resp) => resp.json())
        .then((resp) => {
          console.log(resp);
        });
      ///// he/she add me
      socket.emit("friend added", {
        userid: this.user.userid,
        faceurl: this.user.faceurl,
        to: this.PeopleWindowParas.selectedUser,
      });
    },
    chatNow() {
      console.log("start chatnow");
      console.log(
        "this.selectedChatUsername before:" + this.selectedChatUsername
      );
      this.selectedChatUsername = this.PeopleWindowParas.selectedUser;
      console.log(
        "this.PeopleWindowParas.selectedUser:" +
          this.PeopleWindowParas.selectedUser
      );
      this.tabShowing = "recentChatTab";
    },
    initialize() {
      fetch("http://localhost:4000/api/users/" + this.user.userid, {
        method: "GET",
      })
        .then((resp) => resp.json())
        .then((resp) => {
          //                        this.friendList=resp.friends;
          this.friendList = new Map(
            resp.friends.map((i) => [
              i.username,
              {
                id: i.id,
                faceurl: i.faceurl,
                UnreadMessageCount: i.UnreadMessageCount,
                online: false
              },
            ])
          );
          this.user.faceurl = resp.faceurl;
          this.loading = false;
          console.log("in chat: this.user.faceurl:" + this.user.faceurl);
          socket.auth = {
            username: this.user.username,
            faceurl: this.user.faceurl,
            userid: this.user.userid,
          };
          socket.connect();
        });
    },
  },
};
</script>
<style>
.userIcon {
  background-color: rgba(0, 0, 0, 0) !important;
  font-size: 38px;
  margin-right: 10px;
}
.click-menu .modal__dialog {
  /* z-index: 1; */
  position: absolute;
  padding: 15px 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 15px;
}

.click-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.click-menu ul li {
  width: 100%;
  padding: 10px 15px;
  margin-bottom: 5px;
}
.click-menu ul li i {
  padding-right: 10px;
}
.click-menu ul li:hover {
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.2);
}

#profile-menu .modal__dialog {
  top: 63px;
  left: 65px;
}

.chat {
  /* margin-top: auto; */
  /* margin-bottom: auto; */
  position: relative;
}
.card {
  position: absolute;
  top: 50%;
  height: 600px;
  margin-top: -180px;
  border-radius: 15px !important;
}
.contacts_card {
  background-color: rgba(0, 0, 0, 0.4) !important;
}
.left-body {
  padding: 0.75rem 0 !important;
  overflow-y: auto;
  white-space: nowrap;
}
.msg_card_body {
  overflow-y: auto;
}
.card-header {
  border-radius: 15px 15px 0 0 !important;
  border-bottom: 0 !important;
  /* border: yellow 1px solid; */
}
.card-footer {
  border-radius: 0 0 15px 15px !important;
  border-top: 0 !important;
  /* border: yellow 1px solid; */
}
.left-card-footer {
  border-radius: 0 0 15px 15px !important;
  border-top: 0 !important;
  background-color: rgba(0, 0, 0, 0.3);
  padding: 5px 0 5px 0;
  /* border: yellow 1px solid; */
}
.tab {
  display: inline;
  width: 33.3%;
  float: left;
  height: 100%;
  /* border: green 1px solid; */
  justify-content: center;
  display: flex;
}
.tabicon {
  font-size: 25px;
  color: white;
}
.container {
  align-content: center;
}

.search {
  border-radius: 15px 0 0 15px !important;
  background-color: rgba(0, 0, 0, 0.3) !important;
  border: 0 !important;
  color: white !important;
}
.search:focus {
  box-shadow: none !important;
  outline: 0px !important;
}
.type_msg {
  background-color: rgba(0, 0, 0, 0.3) !important;
  border: 0 !important;
  color: white !important;
  height: 60px !important;
  overflow-y: auto;
}
.type_msg:focus {
  box-shadow: none !important;
  outline: 0px !important;
}
.attach_btn {
  border-radius: 15px 0 0 15px !important;
  background-color: rgba(0, 0, 0, 0.3) !important;
  border: 0 !important;
  color: white !important;
  cursor: pointer;
}
.send_btn {
  border-radius: 0 15px 15px 0 !important;
  background-color: rgba(0, 0, 0, 0.3) !important;
  border: 0 !important;
  color: white !important;
  cursor: pointer;
}
.search_btn {
  border-radius: 0 15px 15px 0 !important;
  background-color: rgba(0, 0, 0, 0.3) !important;
  border: 0 !important;
  color: white !important;
  cursor: pointer;
}
.contacts {
  list-style: none;
  padding: 0;
}
.contacts li {
  width: 100% !important;
  padding: 5px 10px;
  margin-bottom: 15px !important;
}
.active {
  background-color: rgba(0, 0, 0, 0.3);
}

.online_icon {
  position: absolute;
  height: 15px;
  width: 15px;
  background-color: #4cd137;
  border-radius: 50%;
  bottom: 0.2em;
  right: 0.4em;
  border: 1.5px solid white;
}
.offline {
  background-color: #c23616 !important;
}
.user_info {
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 15px;
 
}
.user_info span {
  font-size: 20px;
  color: white;
}
.user_info p {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
}


@media (max-width: 576px) {
  .contacts_card {
    margin-bottom: 15px !important;
  }
}

/* #profile-menu .modal__dialog{ */
/*     border: 1px red solid; */
/*     padding: 15px 0; */
/*     background-color: rgba(0,0,0,0.5); */
/*     color: white; */
/*     border-radius: 15px; */
/*     top: 30px; */
/*     right: 15px; */

/* } */
</style>
