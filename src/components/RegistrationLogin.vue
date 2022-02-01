<template>
<div class="form-v8-content row justify-content-center h-100">
    <div class="form-right">
        <!-- do not use class tab, very weird, seems occupied by bootstrap -->
            <div class="mytabs">
                <div class="tab-inner">
                    <button class="tablinks" v-on:click="newUser= true" v-bind:class="{ active: newUser}">Sign Up</button>
                </div>
                <div class="tab-inner">
                    <button class="tablinks" v-on:click="newUser=false" v-bind:class="{ active: !newUser}">Sign In</button>
                </div>
            </div>
            <div>
                <template v-if="newUser">
                    <registration-form @switch2logintab="switch2logintab"> </registration-form>
                </template>
                <template v-else>
                    <login-form @changeAuthenticationStatus="changeAuthenticationStatus"> </login-form>
                </template>
            </div>
            <!-- <button class="btn btn-lg btn-primary btn-block" id="logout">LOG ME OUT</button> -->
            <!-- <button class="btn btn-lg btn-primary btn-block" id="justCheck">just check</button> -->
        </div>
</div>
</template>

<script>
    import RegistrationForm from "./RegistrationForm.vue"
   import LoginForm from "./LoginForm.vue"
export default {
    name: 'RegistrationLogin',
    components: { LoginForm ,RegistrationForm },
    data(){
        return{
            newUser: true,
        }
    },
    create(){
        
    },
    methods:{
        switch2logintab(){
            this.newUser=false;
        },
        changeAuthenticationStatus(username, userid){
            this.$emit("authenticateSucceed", username,userid);
        }
    }
}
</script>

<style>


input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
    transition: background-color 5000s ease-in-out 0s;
}


input:-webkit-autofill { 
    -webkit-text-fill-color: #fff !important;
}

.form-v8-content .form-right {

    padding: 5px 0;
    width: 410px;
    /* margin: auto; */
    margin-top: 5%;
    margin-bottom: auto;
  
    border-radius: 15px !important;
    background-color: rgba(0,0,0,0.4) !important;
}

.form-v8-content .mytabs {
	margin: 10px 0 33px;
	width: 100%;
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    -o-justify-content: space-between;
    -ms-justify-content: space-between;
    -moz-justify-content: space-between;
    -webkit-justify-content: space-between;
    /* border: pink 1px solid; */
}
.form-v8-content .mytabs .tab-inner {
    width: 50%;
}
.form-v8-content .mytabs .tablinks {
    background: transparent; 
	border: none;
	outline: none;
	-o-outline: none;
	-ms-outline: none;
	-moz-outline: none;
	-webkit-outline: none;
	font-family: 'Source Sans Pro', sans-serif;
        font-size: 20px;
        font-weight: 400;
        color: #ccc;
        padding-bottom: 18px;
        border-bottom: 3px solid;
        border-bottom-color: rgba(255, 255, 255, 0.2);
        width: 100%;
}

.form-v8-content .mytabs .tablinks.active {
        font-weight: 700;
        color: #fff;
        border-bottom-color: #30e1df;
}
.form-v8-content .form-detail {
    padding:  0 40px;
}
.inputFields{
    height: 220px;
}
.form-v8-content .form-row {
    width: 100%;
    /* position: relative; */
    /* border: yellow 1px solid; */
}

.form-v8-content .form-row .form-row-inner {
        position: relative;
        width: 100%;
}
.form-v8-content .form-row .form-row-inner .error {
    position: absolute; 
  
    /* top: -2px; */
    /* left: 10px; */
    margin-left: -180px;
    margin-top: -30px;
    font-size: 14px;
    color: #d43d1e;
    font-weight: 400;
    transform-origin: 0 0;
    transition: all .2s ease;
    -moz-transition: all .2s ease;
    -webkit-transition: all .2s ease;
    -o-transition: all .2s ease;
    -ms-transition: all .2s ease;
}

.form-v8-content .form-row .form-row-inner .label {
        position: absolute;
    top: -2px;
    left: 10px;
    font-size: 16px;
    color: #f2f2f2;
    font-weight: 400;
    transform-origin: 0 0;
    transition: all .2s ease;
    -moz-transition: all .2s ease;
    -webkit-transition: all .2s ease;
    -o-transition: all .2s ease;
    -ms-transition: all .2s ease;
}
.form-v8-content .form-row .form-row-inner .border {
        position: absolute;
    bottom: 31px;
    left: 0;
    height: 1px;
    width: 100%;
    background: #53c83c;
    transform: scaleX(0);
    -moz-transform: scaleX(0);
    -webkit-transform: scaleX(0);
    -o-transform: scaleX(0);
    -ms-transform: scaleX(0);
    transform-origin: 0 0;
    transition: all .15s ease;
    -moz-transition: all .15s ease;
    -webkit-transition: all .15s ease;
    -o-transition: all .15s ease;
    -ms-transition: all .15s ease;
}
.form-v8-content .form-detail .input-text {
        margin-bottom: 25px;
}
.form-v8-content .form-detail input {
        width: 100%;
    padding: 0px 10px 5px 10px;
    border: 1px solid transparent;
    border-bottom: 1px solid;
    border-bottom-color: rgba(255, 255, 255, 0.2);
    background: transparent;
    appearance: unset;
    -moz-appearance: unset;
    -webkit-appearance: unset;
    -o-appearance: unset;
    -ms-appearance: unset;
    outline: none;
    -moz-outline: none;
    -webkit-outline: none;
    -o-outline: none;
    -ms-outline: none;
    font-size: 18px;
    color: #fff;
    font-weight: 300;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -o-box-sizing: border-box;
    -ms-box-sizing: border-box;
}
.form-v8-content .form-detail .form-row .input-text:focus{
        border-bottom: 1px solid #53c83c;
        background: transparent;
}
.form-v8-content .form-detail .form-row .input-text:focus + .label,
.form-v8-content .form-detail .form-row .input-text:valid + .label{
        transform: translateY(-26px) scale(1);
        -moz-transform: translateY(-26px) scale(1);
    -webkit-transform: translateY(-26px) scale(1);
    -o-transform: translateY(-26px) scale(1);
    -ms-transform: translateY(-26px) scale(1);

}
.form-v8-content .form-detail .form-row .input-text:focus  + .border,
.form-v8-content .form-detail .form-row .input-text:valid  + .border{
        transform: scaleX(1);
        -moz-transform: scaleX(1);
    -webkit-transform: scaleX(1);
    -o-transform: scaleX(1);
    -ms-transform: scaleX(1);

}
.form-v8-content .form-detail  .form-row-last input{
        background: #fff;
        border-radius: 5px;
        -o-border-radius: 5px;
        -ms-border-radius: 5px;
        -moz-border-radius: 5px;
        -webkit-border-radius: 5px;
        width: 160px;
        border: none;
        margin: 5px 0 5px 0px;
        cursor: pointer;
        font-family: 'Source Sans Pro', sans-serif;
        color: #333;
        font-weight: 700;
        font-size: 18px;
        padding: 11px;
}
.form-v8-content .form-detail .form-row-last input:hover {
        background: #ccc;
}

/* Responsive */
@media screen and (max-width: 991px) {
        .form-v8-content {
                margin: 180px 20px;
                flex-direction:  column;
                -o-flex-direction:  column;
                -ms-flex-direction:  column;
                -moz-flex-direction:  column;
                -webkit-flex-direction:  column;
        }
        .form-v8-content .form-left {
                width: 100%;
        }
        .form-v8-content .form-left img {
                width: 100%;
                border-bottom-left-radius: 0px;
            border-top-right-radius: 8px;
        }
        .form-v8-content .form-right {
                width: auto;
                border-top-right-radius: 0;
                border-bottom-left-radius: 8px;
        }
        .form-v8-content .mytabs {
                margin-top: 45px;
        }
        .form-v8-content .form-detail .form-row-last input {
                margin-bottom: 80px;
	}
}

@media screen and (max-width: 325px) {
	.form-v8-content .mytabs {
		flex-direction: column;
		-o-flex-direction: column;
		-ms-flex-direction: column;
		-moz-flex-direction: column;
		-webkit-flex-direction: column;
	}
}


</style>
