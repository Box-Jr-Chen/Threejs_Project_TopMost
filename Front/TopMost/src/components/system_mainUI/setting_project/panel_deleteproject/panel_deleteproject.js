export default {
    name: 'panel_deleteproject',
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
                this.$store.commit('Hide_Panel_deleteProject');
                this.$store.state.threejs.Active_controls();
            },
            delete_project(){
                var self = this;

                self.$store.dispatch('A_DeleteProjects',self.$store.state.project_delete.id).then(response =>{
                  if(response.result !=='error')
                    {
                    
                      //更新
                      self.update_projects();
                    }
                });

            },
            update_projects(){
                  var self = this;
                  self.$store.dispatch('A_GetProjects').then(response =>{
                    if(response.result !=='error')
                      {
                          self.$store.state.projects = response;
                          self.$store.commit('Hide_Panel_deleteProject');
                      }
                  });
            }

      }
}