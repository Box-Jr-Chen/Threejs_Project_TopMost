export default {
    name: 'panel_addpallet',
    components: {
 
      },
      computed:{
      },
      data(){
          return{
              height:0,
              width:0,
              showMsgTime:null
          }
      },
      mounted(){
          var self= this;
          const contain = document.getElementById('panel_addproject');
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
                this.$store.commit('Hide_Panel_addProject');
                this.$store.state.threejs.Active_controls();
            },
          add_project(){
              var self = this;
              var data={
                "width":self.$store.state.project_add_fix.width,
                "height":self.$store.state.project_add_fix.height,
                "length":self.$store.state.project_add_fix.length
              };
              self.$store.dispatch('A_PostProjects',data).then(response =>{
                console.log(response);
                if(response.result !=='error')
                  {
                    //更新
                    self.update_projects();
                  }
                  else 
                  {
                    self.error_msg(response.msg); 
                  }
              });

          },
          fix_project(){
            var self = this;
            var data={
              "id":self.$store.state.project_add_fix.id,
              "width":self.$store.state.project_add_fix.width,
              "height":self.$store.state.project_add_fix.height,
              "length":self.$store.state.project_add_fix.length
            };

            self.$store.dispatch('A_UpdateProjects',data).then(response =>{
              if(response.result !=='error')
                {
                  //更新
                  self.update_projects();
                }
                else 
                {
                  self.error_msg(response.msg); 
                }
            });
          },
          update_projects(){
                var self = this;
                self.$store.dispatch('A_GetProjects').then(response =>{
                  if(response.result !=='error')
                    {
                        self.$store.state.projects = response;
                        self.$store.commit('Hide_Panel_addProject');
                    }
                });
          },
          error_msg(msg){
            var self = this;

            self.$store.state.project_error =msg;
            

            if( self.showMsgTime !==null)
                clearTimeout(self.showMsgTime);

             self.showMsgTime = setTimeout(() => {
                self.$store.state.project_error ='';
              }, 1000);
          }
      }
}