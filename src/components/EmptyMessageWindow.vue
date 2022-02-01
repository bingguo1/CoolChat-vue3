<template>
<div class="card card_message">
    <div class="emptymessagewindow">
        <h>If you chatlist is emtpy, please find a friend in friendlist tab(the middle tab) and click the "chat now" button!</h>
    </div>
    </div>
</template>
<script>
    
export default{
    name:"EmptyMessageWindow",
    
    created(){
        console.log("created from empty window")
    },
    mounted(){
        console.log("mounted from empty window")
    },
    unmounted(){
        console.log("unmounted from empty window")
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
