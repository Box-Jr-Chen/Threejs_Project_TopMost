import rightside from '@/components/system_mainUI/setting_project/rightside/rightside.vue'
import panel_addproject from '@/components/system_mainUI/setting_project/panel_addproject/panel_addproject.vue'

import panel_deleteproject from '@/components/system_mainUI/setting_project/panel_deleteproject/panel_deleteproject.vue'

export default {
    name: 'setting_pallet',
    components: {
        rightside,
        panel_addproject,
        panel_deleteproject
      },
      computed:{
            rightpanel_pos:function (){

                    if(this.$store.state.contain_rightpanel !=null)
                    {
                        //var x = (this.$store.state.border_main*2) + this.$store.state.width_main -  (this.$store.state.contain_rightpanel.offsetWidth/2);
                        var x = (this.$store.state.width_main/2) -(this.$store.state.contain_rightpanel.offsetWidth/2) -15;
                        return "left:"+x+"px; top: 50%;";
                    }

                return "left:0px; top:0px;";
            }
      },
      data(){
          return{
          }
      },
      mounted(){
            this.$store.state.contain_rightpanel = document.getElementById("rightside_project");
             //   console.log(contain_rightpanel.offsetWidth+";"+contain_rightpanel.offsetHeight );
             this.$store.commit('Hide_Panel_addProject');
             this.LoadProjects();
      },
      methods:{
            LoadProjects()
            {
                var self = this;
                self.$store.dispatch('A_GetProjects').then(response =>{
                    if(response.result !=='error')
                    {
                        self.$store.state.projects = response;
                    }
                });
            }
      }
}