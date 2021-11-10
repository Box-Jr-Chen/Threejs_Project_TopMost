import navbar from '@/components/navbar/navbar.vue'
import Leftbar from '@/components/system_mainUI/Leftbar/Leftbar.vue'
// import system_drawMap from '@/components/system_drawMap/system_DrawMap.vue'
// import system_WH_FrameLess from '@/components/system_WH_FrameLess/system_WH_FrameLess.vue'
import system_mainUI from '@/components/system_mainUI/system_mainUI.vue'

// import json_factory from "@/assets/dxf/20210526_3.json"
export default {
    name: 'System_Main',
    components: {
      // system_drawMap,
      // system_WH_FrameLess,
      navbar,
      system_mainUI,
      Leftbar,

      },
      computed:{
        leftmargin: function() {
            var     left =  'left:'+((window.innerWidth - this.$store.state.width_main)/2)+'px';
            return  left;   
        }
      },
      data(){
          return{
            waitSysInit :null,
          }
      },
      mounted(){
        var self = this;
         const container = document.getElementById('container');
         self.$store.state.threejs.init(container);

        self.animate();

        document.addEventListener('mouseup', function(event) { 
          event
          self.mouseup();
        }, true);
 
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
        },
        mousemove(event){
            var self = this;

            if(self.$store.state.threejs.mapDesign.Sys_Status_now ==self.$store.state.threejs.mapDesign.Sys_MapStatus.select)
            {
              self.$store.state.threejs.mapDesign.mousemove(event.offsetX,event.offsetY);
            }
        },
        mouseup(){
          var self = this;
          self.$store.state.threejs.MouseUp();
        }
      }
}