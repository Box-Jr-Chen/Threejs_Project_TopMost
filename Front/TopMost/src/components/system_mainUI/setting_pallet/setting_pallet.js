import rightside from '@/components/system_mainUI/setting_pallet/rightside/rightside.vue'
import panel_addpallet from '@/components/system_mainUI/setting_pallet/panel_addpallet/panel_addpallet.vue'
export default {
    name: 'setting_pallet',
    components: {
        rightside,
        panel_addpallet
      },
      computed:{
            rightpanel_pos:function (){

                    if(this.$store.state.contain_rightpanel !=null)
                    {
                        //var x = (this.$store.state.border_main*2) + this.$store.state.width_main -  (this.$store.state.contain_rightpanel.offsetWidth/2);
                        var x = this.$store.state.width_main -(this.$store.state.contain_rightpanel.offsetWidth/2) -15;
                        var y = (this.$store.state.height_main *(3/4)) -  (this.$store.state.contain_rightpanel.offsetHeight/2);
                        return "left:"+x+"px; top:"+y+"px;";
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
             //   console.log(contain_rightpanel.offsetWidth+";"+contain_rightpanel.offsetHeight );
             this.$store.commit('Hide_Panel_addPallet');
      },
      methods:{
  
      }
}