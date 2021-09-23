import set_area from '@/components/system_mainUI/set_area/set_afd_area/set_afd_area.vue'
export default {
    name: 'rightside',
    components: {
        set_area
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
            show_addpanel(){
                if( this.$store.state.show_afd) return;
                this.$store.commit('Show_Panel_adfPallet');
                this.$store.state.show_afd = true;

                this.$store.commit('Create_Ins_AddArea');
            },
            show_fixpanel(item){
                this.$store.commit('Show_Panel_addPallet');

                this.$store.state.pillet_add_fix.id =item.id;
                this.$store.state.pillet_add_fix.width =item.width;
                this.$store.state.pillet_add_fix.length =item.length;
                this.$store.state.pillet_add_fix.height =item.height;
            },
            show_deletepanel(index){
                this.$store.commit('Show_Panel_deletePallet');
                this.$store.state.pillet_delete.id =index;

            },
      }
}