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
          //顯示產生區域介面
            show_addpanel(){
                document.addEventListener( 'mousedown', this.onDocumentMouseDown, false );
                document.addEventListener( 'mousemove', this.onDocumentMouseMove, false );
                this.$store.state.threejs.container.style.cursor = "crosshair";
                if( this.$store.state.show_afd) return;
                this.$store.state.show_afd = true;
                this.$store.state.afd_isAdd=true;
                this.$store.commit('Show_Panel_adfArea');
                // this.$store.commit('Create_Ins_AddArea');
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
            //check in fixnow
            check_area_can_fix_fixnow(index){
                var self = this;
                index
                    if(self.$store.state.show_afd)     return false;
                var result= true;
                self.$store.state.pallet_exit.forEach(e=>{
                    if(e.id_areas === self.$store.state.areas[index].id) 
                    {
                        result = false;
                        return result;
                    }
                });
                return result;
            },
            //如果有貨物在上面不給修改區域
            check_area_can_fix(index){
                var self = this;

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
            },


            onDocumentMouseDown(event){
                console.log(event);
                var self =this;

                if(event.button ===0)
                {
                    self.$store.state.threejs.add_clickEvent_Area(event);


                    if(self.$store.state.threejs.area_create_click >=2)
                    {
                        document.removeEventListener("mousedown", this.onDocumentMouseDown, false);
                        self.$store.state.threejs.area_create_click =0;
    
    
                        var borders ='['+
                        '['+self.$store.state.threejs.area_create_vertex[0].vertex[0]+','+-self.$store.state.threejs.area_create_vertex[0].vertex[2]  +'],'+
                        '['+self.$store.state.threejs.area_create_vertex[0].vertex[0]+','+-self.$store.state.threejs.area_create_vertex[1].vertex[2] +'],'+
                        '['+self.$store.state.threejs.area_create_vertex[1].vertex[0]+','+-self.$store.state.threejs.area_create_vertex[1].vertex[2]+'],'+
                        '['+self.$store.state.threejs.area_create_vertex[1].vertex[0]+','+-self.$store.state.threejs.area_create_vertex[0].vertex[2] +'],'+
                        '['+self.$store.state.threejs.area_create_vertex[0].vertex[0]+','+-self.$store.state.threejs.area_create_vertex[0].vertex[2]  +']'+']';
            
                        var data={
                            'id_warehouse' : self.$store.state.factory_id,
                            'title' : "",
                            'borders' : borders
                        }
            
                        self.$store.dispatch('A_PostArea',data).then(response =>{
                              if(response.result !=='error')
                              {
                                self.$store.state.area_show_afd = false;
                                self.$store.state.show_afd = false;
                                self.$store.state.threejs.CreateArea_Delete_01();
                                self.$store.state.threejs.ModifyArea_cancel_01();
    
                                self.$store.commit('LoadAreas');
                                self.$store.state.threejs.area_create_vertex[0].vertex =[];
                                self.$store.state.threejs.area_create_vertex[1].vertex =[];
    
                                self.$store.state.show_afd = false;
                                self.$store.state.afd_isAdd=false;
                                self.$store.commit('Hide_Panel_adfArea');
                                self.$store.state.threejs.container.style.cursor = "default";
                              }
                            
                          });
    
                    }
                }
                else if(event.button ===2)  //取消新增
                {
                    document.removeEventListener("mousemove", this.onDocumentMouseMove, false);
                    document.removeEventListener("mousedown", this.onDocumentMouseDown, false);
                    self.$store.state.threejs.clear_area_tip();
                    self.$store.state.threejs.area_create_click =0;
                    self.$store.state.threejs.area_create_vertex[0].vertex =[];
                    self.$store.state.threejs.area_create_vertex[1].vertex =[];

                    self.$store.state.show_afd = false;
                    self.$store.state.afd_isAdd=false;
                    self.$store.commit('Hide_Panel_adfArea');
                    self.$store.state.threejs.container.style.cursor = "default";
                }



            },
            onDocumentMouseMove(event){
                event
                var self =this;
                self.$store.state.threejs.add_clickMove_Area(event);
                if(self.$store.state.threejs.area_create_click >=2)
                {
                    document.removeEventListener("mousemove", this.onDocumentMouseMove, false);
                }
            }
      }
}