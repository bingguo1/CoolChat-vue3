<template>
<!-- <transition name="fade"> -->
   <div class="mymodal" v-if="show">
       <div class="modal__backdrop" @click="closeModal()"/>
      <div class="modal__dialog">         
            <slot></slot>
            
      </div>
   </div>
<!-- </transition> -->
</template>


<script>
export default {
    name: 'ModalBase',
    data() {
        return {
            show: false
        };
    },
    methods: {
        closeModal() {
            this.show = false;
            document.querySelector("body").classList.remove("overflow-hidden");
        },
        openModal() {
            this.show = true;
            document.querySelector("body").classList.add("overflow-hidden");
        }
    }
    
}
</script>
<style>  
.mymodal {  
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 9;
    overflow-x: hidden;
    overflow-y: auto;
 
}
.modal__backdrop{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    /* background-color: rgba(0, 0, 0, 0.3); */
    
    z-index: 1;
}
.mymodal .modal__dialog{
    /* position: relative; */
    /* width: 600px; */
    /* background-color: #ffffff; */
    /* border-radius: 5px; */
    /* margin: 50px auto; */
    /* display: flex; */
    /* flex-direction: column; */
  
    z-index: 2;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

</style>
