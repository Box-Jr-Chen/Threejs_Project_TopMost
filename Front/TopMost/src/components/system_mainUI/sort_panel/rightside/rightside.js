export default {
    name: 'rightside',
    components: {
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
            //開始演算法
            startAlgs()
            {
              var self = this;
              if(!self.$store.state.isstart_sort)
              {     
                  self.$store.state.isstart_sort = true;
                  self.$store.state.threejs.WH_FrameLess.DeleteProject();
      
                  self.sortPRoject_recommand();
                  //排列
              }
            },
            sortPRoject_recommand()
            {
                  var self= this;
                  self.$store.state.isstart_sort = 1;
                  self.$store.dispatch('A_Postsorting_project').then(response =>{
                      if(response.result ===undefined)
                      {
                        self.$store.state.isstart_sort = 0;
                        return;
                      }

                      if(response.result==="success")
                      {
                          //console.log(response);
                           self.$store.state.pallet_sort_finish = response.cause;
                           self.$store.state.pallet_sort_finish.forEach(function(project){
                                 var init_pos = JSON.parse(project.init);
                        //     // console.log(project.pos);
                                 self.$store.state.threejs.WH_FrameLess.CreateProject(project.pallet,init_pos,project.pos);

                           });
                           self.$store.state.isstart_sort = 2;
                      }
                  });
            },
            //托盤已放置
            pallet_HasSet()
            {
                var self =this;
                if(self.$store.state.pallet_sort_finish.length >0)
                {
                    const updatePallet =  self.$store.state.pallet_sort_finish.map(e =>{
                            delete e['init'];
                            delete e['type'];
                            e['pos']=JSON.stringify(e['pos']);
                            return e;
                    });

                    const  PalletData ={
                        'pallet':JSON.stringify(updatePallet)
                    }; 

                    self.$store.dispatch('A_UpdatePallet_muliti',PalletData).then(response =>{
                        if(response.result ==='update success')
                         {
                            self.$store.state.pallet_sort =[];

                            self.$store.state.pallet_sort_finish=[];
                            self.$store.state.isstart_sort = 0;

                            self.$store.dispatch('A_GetPallet_Sort').then(response =>{
                                if(response.result !=='error')
                                 {
                                     self.$store.state.pallet_sort = response;
                                 }
                             });
                         }
                     });

                }
            }
      }
}