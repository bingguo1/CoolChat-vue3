<template>
<div class="card card_message">
    <div class="emptymessagewindow">
        <p>If you chatlist is emtpy, please find a friend in friendlist tab(the middle tab) and click the "chat now" button!</p>
    </div>
    </div>
</template>
<script>
    
export default{
    name:"TestWindow",
    
    created(){
        console.log("created from Test window")
    },
    mounted(){
        console.log("mounted from Test window")
    },
    unmounted(){
        console.log("unmounted from Test window")
    }
}
</script>
<style>
.emptymessagewindow{
    margin: auto;
    width: 350px;
    color: white;
    font-size: 20px;
}
.card_message{
         background-color: rgba(0,0,0,0.4) !important;
    }
</style>
