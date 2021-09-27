export default {
    name: 'panel_deletepallet',
    components: {
 
      },
      computed:{
      },
      data(){
          return{
              // height:0,
              // width:0,
              // length:0
          }
      },
      mounted(){
          var self= this;
          const contain = document.getElementById('panel_delete');
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
            hide_deletepanel(){
                this.$store.commit('Hide_Panel_deleteArea');
                this.$store.state.threejs.Active_controls();
            },
            delete_Area(){
                var self = this;

                self.$store.dispatch('A_DeleteArea',self.$store.state.areas_delete.id).then(response =>{
                  if(response.result !=='error')
                    {
                      //更新
                      self.update_pillets();
                      self.$store.state.threejs.Active_controls();
                    }
                });

            },
            update_pillets(){
                  var self = this;

                  //讀取工廠區域
                  self.$store.commit('LoadAreas');
                  setTimeout(()=>{
                    self.$store.commit('Hide_Panel_deleteArea');
                  },1000);
                  
            }

      }
}