<template>
    <div>
   <form class="form-detail" action="" method="post" id="sign-in-form" @submit.prevent="login">
                <div class="inputFields" id="sign-in" >
                    <div class="form-row login-form-row">
                        <label class="form-row-inner">
                            <input type="text" v-model="username" name="username" id="username" class="input-text" required>
                            <span class="label">Username</span>
                            <span class="border"></span>
                        </label>
                    </div>               
                    <div class="form-row login-form-row">
                        <label class="form-row-inner">
                            <input type="password" v-model="password" name="password" id="password" class="input-text" autocomplete="on" required>
                            <span class="label">Password</span>
                            <span class="border"></span>
                        </label>
                    </div>
                </div>
                <div class="form-row-last">
                    <input type="submit" name="register" value="Sign In">
                     <div class="submiterror" :class="{success: succeeded}">{{submitResult}}</div>
                </div>
   </form>
   </div>
</template>

<script>
export default {
    name: 'LoginForm',
    data(){
        return{
            username:"",
            password:"",
            submitResult:"",
            succeeded:false,
        }
    },
    methods:{
            login(){
                fetch("http://localhost:4000/session/login", {
                    method: "POST",
                    credentials: 'include',
                    body: JSON.stringify({
                        username: this.username,
                        password: this.password
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                    .then(resp => resp.json())
                    .then(resp => {
                        if(resp[0]==="success"){
                            this.succeeded=true;
                            this.submitResult="Successfully logged in, let's chat now!";
                            this.$emit("changeAuthenticationStatus",  this.username, resp[1]);
                        }
                        else{
                            this.username="";
                            this.password="";
                            this.submitResult="Username or password is not right!";
                        }                      
                    });
            },     
    }
}
</script>

<style>
.login-form-row{
    padding-top: 30px;
    padding-bottom: 10px;
    /* border: 1px yellow solid; */
}
</style>
