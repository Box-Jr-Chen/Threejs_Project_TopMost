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
          const contain = document.getElementById('panel_deletepallet');
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
            delete_pillet(){
                var self = this;

                self.$store.dispatch('A_DeletePallets',self.$store.state.pillet_delete.id).then(response =>{
                  if(response.result !=='error')
                    {
                      //更新
                      self.update_pillets();
                    }
                });

            },
            update_pillets(){
                  var self = this;
                  self.$store.dispatch('A_GetPallets').then(response =>{
                    if(response.result !=='error')
                      {
                          self.$store.state.pillets = response;
                          self.$store.commit('Hide_Panel_deletePallet');
                      }
                  });
            }
            // width_type(num){
            //     return this.$store.state.pillet_add_fix.width = parseInt(num);
            // },
            // height_type(num){
            //     return this.$store.state.pillet_add_fix.height = parseInt(num);
            // }
      }
}