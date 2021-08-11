export default {
    name: 'panel_addpallet',
    components: {
 
      },
      computed:{
      },
      data(){
          return{
              height:0,
              width:0
          }
      },
      mounted(){
          var self= this;
          const contain = document.getElementById('panel_addpallet');
          contain.addEventListener('mouseenter',()=>{
            self.$store.state.threejs.UnActive_controls();
          });
          contain.addEventListener('mouseleave',()=>{
            self.$store.state.threejs.Active_controls();
          });
        //   var list =  window.getEventListeners(contain);
        //   console.log(list);
      },
      methods:{
            hide_addpanel(){
                this.$store.commit('Hide_Panel_addPallet');
                this.$store.state.threejs.Active_controls();
            },
            width_type(num){
                return this.width = parseInt(num);
            },
            height_type(num){
                return this.height = parseInt(num);
            }
      }
}