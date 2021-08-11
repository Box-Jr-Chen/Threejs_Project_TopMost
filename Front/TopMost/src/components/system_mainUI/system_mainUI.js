import setting_pallet from '@/components/system_mainUI/setting_pallet/setting_pallet.vue'
export default {
    name: 'system_mainUI',
    components: {
        setting_pallet
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
        }
      }
}