export default {
    name: 'panel_addpallet',
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
            add_pillet(){
                var self = this;
                var data={
                  "width":self.$store.state.pillet_add_fix.width,
                  "height":self.$store.state.pillet_add_fix.height,
                  "length":self.$store.state.pillet_add_fix.length
                };

                self.$store.dispatch('A_PostPallets',data).then(response =>{
                  if(response.result !=='error')
                    {
                      //更新
                      self.update_pillets();
                    }
                });

            },
            fix_pillet(){
              var self = this;
              var data={
                "id":self.$store.state.pillet_add_fix.id,
                "width":self.$store.state.pillet_add_fix.width,
                "height":self.$store.state.pillet_add_fix.height,
                "length":self.$store.state.pillet_add_fix.length
              };

              self.$store.dispatch('A_UpdatePallets',data).then(response =>{
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
                          self.$store.commit('Hide_Panel_addPallet');
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