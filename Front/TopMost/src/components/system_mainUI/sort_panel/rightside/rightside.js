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
  //                self.$store.state.threejs.WH_FrameLess.DeleteProject_sort();
      
                  self.sortPRoject_recommand();
                  //排列
              }
            },
            sortPRoject_recommand()
            {
                  var self= this;

                  //停止計時器
                  clearInterval(self.$store.state.t_getpallet); 

                  self.$store.state.isstart_sort = 1;
                  self.$store.dispatch('A_Postsorting_project').then(response =>{

                      if(response.result ===undefined)
                      {
                        self.$store.state.isstart_sort = 0;
                        return;
                      }

                      if(response.result==="success")
                      {
                           self.$store.state.pallet_sort_finish = response.cause;
                           self.$store.state.pallet_sort_finish.forEach(function(project){
                           var init_pos = JSON.parse(project.init);
                           
                           self.$store.state.threejs.WH_FrameLess.CreateProject(project.pallet,init_pos,project.pos,'sort',project.id_areas,project.layout);

                           });
                           self.$store.state.isstart_sort = 2;
                      }
                      else if(response.result==="error")
                      {
                        self.$store.state.isstart_sort = 0;
                        return;
                      }
                  });
            },
            //托盤已放置
            pallet_HasSet()
            {
                var self =this;
                if(self.$store.state.pallet_sort_finish.length >0)
                {
                    var updatePallet =  self.$store.state.pallet_sort_finish.map(e =>{
                            delete e['init'];
                            delete e['type'];
                            e.id_areas = e['area'];
                            e['pos']=JSON.stringify(e['pos']);
                            return e;
                    });

                    var area = updatePallet[0].area;

                    var  PalletData ={
                        'pallet':JSON.stringify(updatePallet)
                    }; 

                    //將棧板位置跟新棧板資料庫
                    self.$store.dispatch('A_UpdatePallet_muliti',PalletData).then(response =>{
                        if(response.result ==='update success')
                         {
                            self.$store.state.pallet_needsort =[];

                            self.$store.state.pallet_sort_finish=[];
                            self.$store.state.pallet_exit.push(...updatePallet);
                            self.$store.state.threejs.WH_FrameLess.PutSortToExit(area);
                            updatePallet =null;
                            PalletData =null;
                            //console.log(self.$store.state.pallet_exit);

                            //重新找需要排列的棧板
                            self.$store.dispatch('A_GetPallet_needSort').then(response =>{
                                if(response.result !=='error')
                                 {
                                     self.$store.state.pallet_needsort = response;
                                     self.$store.commit('WaitToPallet_needSort');
                                     
                                    if(self.$store.state.pallet_needsort.length >0)
                                            self.$store.state.isstart_sort = 0;
                                    else
                                            self.$store.state.isstart_sort = 3;
                                 }
                             });
                         }
                     });

                }
            }
      }
}