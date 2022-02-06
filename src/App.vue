<template>
<div class="container-fluid h-100" id="app">
    <!-- <template v-if="showWindow"> -->
        <template v-if="!loading">
            <template v-if="authenticated">
                <chat  @logoutNow="logoutNow" v-bind:newUserName="username" v-bind:newUserID="userid"> </chat>
            </template>
            <template v-else>
                <registration-login @authenticateSucceed="authenticateSucceed"></registration-login>
            </template>
        </template>

    
   
</div>
</template>

<script>
    
import chat from './components/chat.vue'
import RegistrationLogin from './components/RegistrationLogin.vue'

export default {
    name: 'App',
    components: {
        chat, RegistrationLogin
    },
    data(){
        return{
            loading: true,
            authenticated: false,
            username:"",
            userid:"",
        }
    },
    created(){
         console.log("create() from app.vue");
         fetch("http://localhost:4000/session/justcheck",{
                method: 'GET',
                credentials: 'include',
                headers: {  
                    'Content-Type': 'application/json'
                },
            })
                .then(resp => resp.json())
                .then(resp => {                
                    if(resp==="NoGoodSession"){
                        this.authenticated=false;
                    }
                    else{
                        this.username=resp.username;
                        this.userid=resp.userid;
                        this.authenticated=true;
                        console.log("this.username:"+this.username);
                    }
                    this.loading=false;                
                }
                     )
        console.log("create() from app.vue2");

    },
    methods:{
        authenticateSucceed(username,userid){
            this.username=username;
            this.userid=userid;
            this.authenticated=true;
            console.log("start to authenticate, userid:"+userid);
        },
        logoutNow(){
            this.authenticated=false;
        },    
    },

}
</script>

<style>
    body,html{
    height: 100%;
    margin: 0;
    background: #7F7FD5;
    background: -webkit-linear-gradient(to right, #91EAE4, #86A8E7, #7F7FD5);
    background: linear-gradient(to right, #91EAE4, #86A8E7, #7F7FD5);
    }


</style>
