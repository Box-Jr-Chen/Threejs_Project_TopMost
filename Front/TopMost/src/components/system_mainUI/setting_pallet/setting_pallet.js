import rightside from '@/components/system_mainUI/setting_pallet/rightside/rightside.vue'
import panel_addpallet from '@/components/system_mainUI/setting_pallet/panel_addpallet/panel_addpallet.vue'

import panel_deletepallet from '@/components/system_mainUI/setting_pallet/panel_deletepallet/panel_deletepallet.vue'

export default {
    name: 'setting_pallet',
    components: {
        rightside,
        panel_addpallet,
        panel_deletepallet
      },
      computed:{
            rightpanel_pos:function (){

                    if(this.$store.state.contain_rightpanel !=null)
                    {
                        var x = (this.$store.state.width_main/2) -(this.$store.state.contain_rightpanel.offsetWidth/2) -15;
                        return "left:"+x+"px; top:  50%;";
                    }

                return "left:0px; top:0px;";
            }
      },
      data(){
          return{
          }
      },
      mounted(){

            this.$store.state.contain_rightpanel = document.getElementById("rightside_pallet");

            this.LoadPallet();
      },
      methods:{
          LoadPallet()
          {
                var self = this;
                self.$store.dispatch('A_GetPallets').then(response =>{
                   if(response.result !=='error')
                    {
                        self.$store.state.pillets = response;
                    }
                });
          }
  
      }
}