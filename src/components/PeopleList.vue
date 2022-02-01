<template>
<div>
    <div class="category"  @click="requestListExpand=!requestListExpand">
        <div class="iconBox">
            <span v-show="requestListExpand"><i class="fas expandIcon fa-caret-down"></i></span>
            <span class="expandIconRight" v-show="!requestListExpand"><i class="fas expandIcon fa-caret-right"></i></span>
        </div>
         <div class="categoryNameBox"> New Requests</div>
    </div>
    <ul v-show="requestListExpand" class="peoplelist request-list">
        <li v-for="(user, index) in requestList" :key="index" @click="selectRequest(user[0])" v-bind:class="{active: user[0]==selectedUser && selectedMode=='requestMode'}">
             <div class="d-flex bd-highlight">
                 <div class="people_img_cont">
                     <img :src="user[1].faceurl" class="rounded-circle people_img">
                 </div>
                 <div class="people_user_info">
                     {{user[0]}}
                 </div>
             </div>
        </li>
    </ul>
    
    <div class="category"  @click="friendListExpand=!friendListExpand">
        <div class="iconBox">
            <span v-show="friendListExpand"><i class="fas expandIcon fa-caret-down"></i></span>
            <span class="expandIconRight" v-show="!friendListExpand"><i class="fas expandIcon fa-caret-right"></i></span>
        </div>
         <div class="categoryNameBox"> Friends</div>
    </div>
    <ul v-show="friendListExpand" class="peoplelist friend-list">
        <li v-for="(friend,index) in friendList" :key="index" @click="selectFriend(friend[0])" v-bind:class="{active: friend[0]==selectedUser && selectedMode=='friendMode'}">
             <div class="d-flex bd-highlight">
                 <div class="people_img_cont">
                     <img :src="friend[1].faceurl" class="rounded-circle people_img">
                 </div>
                 <div class="people_user_info">
                     {{friend[0]}}
                 </div>
             </div>
        </li>
    </ul>

    <div class="category"  @click="activeUserListExpand=!activeUserListExpand">
        <div class="iconBox">
            <span v-show="activeUserListExpand"><i class="fas expandIcon fa-caret-down"></i></span>
            <span class="expandIconRight" v-show="!activeUserListExpand"><i class="fas expandIcon fa-caret-right"></i></span>
        </div>
         <div class="categoryNameBox"> Active Users</div>
    </div>
    <ul v-show="activeUserListExpand" class="peoplelist active-user-list">
        <li v-for="(user, index) in activeUserList" :key="index" @click="selectActiveUser(user[0])" v-bind:class="{active: user[0]==selectedUser && selectedMode=='activeUserMode'}">
            <div class="d-flex bd-highlight">
                <div class="people_img_cont">
                    <img :src="user[1].faceurl" class="rounded-circle people_img">
                </div>
                <div class="people_user_info">
                    {{user[0]}}
                </div>
            </div>
        </li>
    </ul>
    
    
</div>
</template>

<script>
export default {
    name: 'PeopleList',
    props:{
        friendList: Object,
        activeUserList: Object,
        requestList: Object,
    },
    data(){
        return{
            selectedMode: "",
selectedUser:"",
requestListExpand: true,
friendListExpand: true,
activeUserListExpand: true,

        }
    },
    created(){
        
    },
    methods:{
        selectActiveUser(username){
            this.selectedMode="activeUserMode";
            this.selectedUser=username;
            this.changeSelectedPeople();
        },
        selectFriend(username){
            this.selectedMode="friendMode";
            this.selectedUser=username;
            this.changeSelectedPeople();
        },
        selectRequest(username){
            this.selectedUser=username;
            this.selectedMode="requestMode";
            this.changeSelectedPeople();
        },
        changeSelectedPeople(){
            this.$emit("changeSelectedPeopleNow",this.selectedMode, this.selectedUser);
        }
        
        
    },
}
</script>

<style>
    .category{
    display: flex;
  
    margin:0px;
    }
    .iconBox{
    width: 30px;
    height: 35px;
    padding: 0px;
    }
    .expandIcon{
    font-size: 38px;
   
    padding: 0px;
    }
    .expandIconRight{
    padding-left: 10px;
    }
    .categoryNameBox{
    
    padding-top:8px;
    height: 35px;
  
    }
    .request-list, .friend-list, .active-user-list{
    
    margin: 0px;
    }

    .peoplelist{
    list-style: none;
    padding: 0;
}
.peoplelist li{
    width: 100% !important;
    padding: 5px 10px;
    margin-bottom: 0px !important;
}
.people_img_cont{
    position: relative;
    height: 50px;
    width: 50px;
}
    .people_img{
    height: 50px;
    width: 50px;
    border:1.5px solid #f5f6fa;
    
    }
    .people_user_info{
    margin-top: auto;
    margin-bottom: auto;
    margin-left: 15px;
    color: white;
    font-size: 20px;
}
    
    
</style>
