<template>
    <main>
        <!-- 主體  -->
        <router-view  class="routerview"  :style="{width:this.$store.state.width_main+'px',height:this.$store.state.height_main+'px'}"></router-view>
    </main>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  data() {
        return {
        }
   },
   methods: {
        displayWindowSize() {
             var self =this;
             self.$store.state.height_main   =  window.innerHeight;
            // self.$store.state.width_main    = (16/9) * window.innerHeight  ;
             self.$store.state.width_main    = window.innerWidth  ;
             self.$store.state.border_main   = (window.innerHeight - self.$store.state.width_main)/2  ;
          }
  },
   mounted() {
    var self =this ;
    this.displayWindowSize();

     //标注渲染
        window.addEventListener('resize', ()=>{
          self.displayWindowSize();
          self.$store.commit('onWindowResize');
        }, false);//添加窗口监听事件（resize-onresize即窗口或框架被重新调整大小）
  }
}
</script>

<style>
body{
    background: rgb(80, 80, 80);
    overflow: hidden;
    padding: 0;
    margin: 0; 
}
#app {
    align-items: center;
    width: 100%;
    height: 42rem;
}
.routerview{
    padding: 0;
    margin:  0 auto;
    box-shadow:  2px 2px 6px rgba(0, 0, 0, 0.5);
}
</style>
