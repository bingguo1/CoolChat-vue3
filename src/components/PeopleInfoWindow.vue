<template>
<div class="card card_people">  
    <div class="peoplewindowBox" v-if="PeopleWindowParas.selectedMode==='friendMode'">
        <button type="button" class="btn btn-success btn-lg" @click="$emit('chatNow')">
            Chat Now
        </button>
    </div>
    <div class="peoplewindowBox" v-else-if="PeopleWindowParas.selectedMode==='activeUserMode'" @click="sendAFriendRequest">
        <button type="button" class="btn btn-success btn-lg">Send Friend Request </button>
    </div>
    <div class="peoplewindowBox" v-else-if="PeopleWindowParas.selectedMode==='requestMode'">
        <p v-for="(content,index) in PeopleWindowParas.requestMessages[PeopleWindowParas.selectedUser]" :key="index">
            {{content}}
        </p>
        <button type="button" class="btn btn-success" @click="$emit('addFriendNow')">
            Add as a friend
        </button>
    </div>

</div>
</template>

<script>
export default {
    name: 'PeopleInfoWindow',
    props: {
        PeopleWindowParas: Object,
    },
    data(){
        return {
            
        }
    },
    methods:{
        sendAFriendRequest(){
            console.log("try to add friend:"+this.PeopleWindowParas.selectedUser);
            this.$emit("sendAFriendRequestNow");
        },
    },
}
</script>

<style>
    .card_people{
    background-color: rgba(0,0,0,0.2) !important;
    }
    .peoplewindowBox{
     margin: auto;
    }
</style>
