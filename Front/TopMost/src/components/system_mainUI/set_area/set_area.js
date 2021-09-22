import rightside from '@/components/system_mainUI/set_area/rightside/rightside.vue'


export default {
    name: 'setting_pallet',
    components: {
        rightside,
        // panel_addpallet,
        // panel_deletepallet
      },
      computed:{
            rightpanel_pos:function (){

                    if(this.$store.state.contain_rightpanel !=null)
                    {
                        var x = (this.$store.state.width_main/2) -(this.$store.state.contain_rightpanel.offsetWidth/2) -15;
                        var y = 0;
                        return "left:"+x+"px; top:"+y+"px;";
                    }

                return "left:0px; top:0px;";
            }
      },
      data(){
          return{
            afd_rightpanel:null,
          }
      },
      mounted(){

            this.$store.state.contain_rightpanel = document.getElementById("rightside_area");
            this.afd_rightpanel = document.getElementById("set_afd_area");

      },
      methods:{

  
      }
}