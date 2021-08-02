 import system_drawMap from '@/components/system_drawMap/system_DrawMap.vue'

export default {
    name: 'System_Main',
    components: {
      system_drawMap
      },
      data(){
          return{

          }
      },
      mounted(){
        var self = this;
        const container = document.getElementById('container');
        self.$store.state.threejs.init(container,()=>{
          self.$store.state.MapDesign.init(
              self.$store.state.threejs.width,
              self.$store.state.threejs.height,
              self.$store.state.threejs.camera,
              self.$store.state.threejs.scene,
              self.$store.state.threejs.raycaster
            );
            self.$store.state.threejs.otherender.push(self.$store.state.MapDesign);
        });

        self.animate();


        //document.addEventListener( 'pointerdown', self.onPointerDown );
        //document.addEventListener( 'pointerup', self.onPointerUp );
      },
      methods:{
        animate() {
            this.$store.state.threejs.animate();
            this.AnimationFrameID = requestAnimationFrame(this.animate);
           },
        onPointerDown(){
          console.log('pointerdown');
        },
        onPointerUp(){
          console.log('pointerup');
        }
      }
}