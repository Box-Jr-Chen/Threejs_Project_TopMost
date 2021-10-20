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
                this.$store.state.show_afd = true;
                this.$store.state.afd_isAdd=true;
                this.$store.commit('Show_Panel_adfArea');
                this.$store.commit('Create_Ins_AddArea');
            },
            show_fixpanel(index,item){
                //  console.log(item);
                this.$store.state.addIns_pos.index = index;
                this.$store.state.addIns_pos.left.x = item.borders[0][0];
                this.$store.state.addIns_pos.left.z = item.borders[0][1];

                this.$store.state.addIns_pos.right.x = item.borders[2][0];
                this.$store.state.addIns_pos.right.z = item.borders[2][1];
                this.$store.state.show_afd = true;
                this.$store.state.afd_isAdd=false;

                
                this.$store.state.threejs.ModifyArea_01(
                this.$store.state.addIns_pos.left.x,
               -this.$store.state.addIns_pos.left.z,
                this.$store.state.addIns_pos.right.x,
               -this.$store.state.addIns_pos.right.z);
                this.$store.commit('Show_Panel_adfArea');
            },
            show_deletepanel(index){
                this.$store.commit('Show_Panel_deleteArea');
                this.$store.state.areas_delete.id =index;
            },
            //如果有貨物在上面不給修改區域
            check_area_can_fix(index){
                var self = this;
                    if(self.$store.state.show_afd)     return false;

                    if(self.$store.state.pallet_exit.lenght <=0) return true;

                    var result= true;
                    self.$store.state.pallet_exit.forEach(e=>{
                        if(e.id_areas === self.$store.state.areas[index].id) 
                        {
                            result = false;
                            return result;
                        }
                    });
                    return result;
            }
      }
}