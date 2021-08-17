import setting_pallet from '@/components/system_mainUI/setting_pallet/setting_pallet.vue'
import setting_project from '@/components/system_mainUI/setting_project/setting_project.vue'
export default {
    name: 'system_mainUI',
    components: {
        setting_pallet,
        setting_project
      },
      computed:{

      },
      data(){
          return{

          }
      },
      mounted(){

      },
      methods:{
        select_panel(index){
            this.$store.state.panel_select = index;
           // console.log(this.$store.state.panel_select);
        }
      }
}