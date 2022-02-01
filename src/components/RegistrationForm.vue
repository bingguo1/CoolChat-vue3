<template>
       <form class="form-detail" action="" method="post"  id="sign-up-form" @submit.prevent="submitRegistration">
                <div class="inputFields"  id="sign-up">
                    <div class="form-row">
                        <label class="form-row-inner">
                            <input type="text" v-model="username" name="username" id="username" class="input-text" required @keyup="validate(username, 0)">
                            <span class="label">Username</span> <span class="error">{{errs[0]}}</span> 
                            <span class="border"></span>
                        </label>
                    </div>
                    <div class="form-row">
                        <label class="form-row-inner">
                            <input type="text" v-model="email" name="your_email" id="your_email" class="input-text" required @keyup="validate(email, 1)">
                            <span class="label">E-Mail</span> <span  class="error">{{errs[1]}}</span> 
                            <span class="border"></span>
                        </label>
                    </div>
                    <div class="form-row">
                        <label class="form-row-inner">
                            <input type="password" v-model="password" name="password" id="password" class="input-text" autocomplete="off" required @keyup="validate(password, 2)">
                            <span class="label">Password</span> <span class="error">{{errs[2]}}</span> 
                            <span class="border"></span>
                        </label>
                    </div>
                    <div class="form-row">
                        <label class="form-row-inner">
                            <input type="password" v-model="confirm_password" name="confirm_password" id="confirm_password" autocomplete="off" class="input-text" required @keyup="validateSamePassword">
                            <span class="label">Confirm Password</span> <span class="error">{{errs[3]}}</span> 
                            <span class="border"></span>
                        </label>
                    </div>
                </div>    
                <div class="form-row-last">
                    <input type="submit" name="register" value="Register">
                    <div class="submiterror" :class="{success: succeeded}">{{submitResult}}</div>
                </div>
       </form>
</template>

<script>
    const rules=[/^[A-Za-z0-9_]+$/,
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,  // eslint-disable-line
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,20}$/
    ];
    const errinfos= ["Must be letter or number or underscore!",
    "Not a valid email address!",
    "At least 1 uppercase, 1 lower letter, 1 number and 1 special character!",
    "Password doesn't match"
    ];

    import {delay} from "../functions.js"
export default {
    name: 'RegistrationForm',
    data(){
        return {
            username:"",
            email:"",
            password:"",
            confirm_password:"",
            errs:["","","",""],
            submitResult:"",
            succeeded: false,
        }
    },
    methods:{
        validate(content, i  ){
            // console.log("content:"+content);
             if (rules[i].test(content)) {
                    this.errs[i]="";
                }else{
                    this.errs[i]=errinfos[i];
                }
        },
        validateSamePassword(){
            if(this.password===this.confirm_password){
                this.errs[3]="";                
            }
            else{
                this.errs[3]=errinfos[3];
            }
        },
        submitRegistration(){
            if(this.errs[0]==="" && this.errs[1]==="" && this.errs[2]==="" && this.errs[3]===""){
                this.createNewUser();
            }
        },    
        createNewUser(){
             fetch(`http://localhost:4000/api/users/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: this.username,
                        email: this.email,
                        password: this.password,
                        faceurl: 'http://localhost:4000/imgs/defaulticon.png'
                    })
                })
                .then(resp => resp.json())
                .then(resp => {
                    if(resp==="success"){
                        this.succeeded=true;
                        this.submitResult="Registration succeeded, you can sign in now!";
                        delay(1000).then(()=> this.$emit('switch2logintab'));
                    }else{
                        this.succeeded=false;
                        this.submitResult=resp;
                    }
                })
        }

    }

}
</script>

<style>
    .form-v8-content .form-detail .form-row-last {
    display: flex;
}

.submiterror{
    margin-left: 15px;
    color: red;
    width: 180px;
    font-size: 15px;

}
.success{
    color: yellow;
}
</style>
