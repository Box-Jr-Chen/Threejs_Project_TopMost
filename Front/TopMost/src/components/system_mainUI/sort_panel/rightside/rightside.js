export default {
    name: 'rightside',
    components: {
      },
      computed:{
      },
      data(){
          return{
              is_custom_enable:false
          }
      },
      mounted(){
          var self = this;
          self.is_custom_enable = false;
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
                           //console.log(response);

                           self.$store.state.pallet_sort_finish = response.cause;

                           //生成演算法出來的各棧板
                           self.$store.state.pallet_sort_finish.forEach(function(project,index){

                           index;

                           var init_pos = JSON.parse(project.init);
                           
                           self.$store.state.threejs.WH_FrameLess.CreateProject(index+1,project.pallet,init_pos,project.pos,'sort',project.id_areas,project.layout);

                           });

                           self.is_custom_enable = true;
                           self.$store.state.isstart_sort = 2;
                      }
                      else if(response.result==="error")
                      {
                        self.$store.state.isstart_sort = 0;
                        return;
                      }
                  });
            },
            type_sort:function(index,item)
            {
                var num = (index+1);
                if(num <10)
                    num = '0'+num;
                    

                return num+'棧板' + '  種類:'+item.id_pallet+' 產品:'+item.id_project;
            },
            btn_algs() //點擊開始演算法
            {
              var self = this;
              if(!self.$store.state.isstart_sort)
              {     
                  self.$store.state.isstart_sort = true;
      
                  self.sortPRoject_recommand();
                  //排列
              }
            },
            //托盤已放置
            btn_pallet_HasSet()
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
            },
            btn_manual_set(index)
            {
                console.log(index);
            }

      }
}