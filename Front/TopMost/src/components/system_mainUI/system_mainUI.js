
import setting_pallet from '@/components/system_mainUI/setting_pallet/setting_pallet.vue'
import setting_project from '@/components/system_mainUI/setting_project/setting_project.vue'
import set_area from '@/components/system_mainUI/set_area/set_area.vue'
import sort_panel from '@/components/system_mainUI/sort_panel/sort_panel.vue'
import system_readDXFMap from '@/components/system_readDXFMap/system_readDXFMap.vue'


export default {
    name: 'system_mainUI',
    components: {
        setting_pallet,
        setting_project,
        set_area,
        sort_panel,
        system_readDXFMap
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
        },

      }
}