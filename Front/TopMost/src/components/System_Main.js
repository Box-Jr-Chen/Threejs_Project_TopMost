export default {
    name: 'System_Main',
    components: {

      },
      data(){
          return{

          }
      },
      mounted(){
        var self = this;
        const container = document.getElementById('container');
        self.$store.state.threejs.init(container);
        self.animate();
      },
      methods:{
        animate() {
            this.$store.state.threejs.animate();
            this.AnimationFrameID = requestAnimationFrame(this.animate);
           },
      }
}