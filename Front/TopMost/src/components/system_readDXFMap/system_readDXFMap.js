
export default {
    name: 'system_readDXFMap',
    components: {
  
      },
      computed:{

      },
      data(){
          return{
            isloading: false,
          }
      },
      mounted(){
            //讀取區域
            var self = this;


            self.getFactories_names();

      },
      methods:{
        getFactories_names(){
            var self = this;

          //獲得interval
          self.$store.dispatch('A_Getinterval').then(response =>{
            if(response.interval !==undefined)
            {
                self.$store.state.threejs.WH_FrameLess.interval =  parseInt(response.interval);

                //獲取工廠名稱清單
                self.$store.dispatch('A_GetFactories').then(response =>{
                    if(response.result !=='error')
                    {
                        self.$store.state.factories = response.meg;
                    }
                });
            }
        });

        },  
        selectIndex(index){
            this.$store.state.factory_select = index;
        },
        //讀取DXF 資源並實例
        Select_Map(){
            var self = this;

            if(self.$store.state.factories.length <=0)
                    return;
            if(self.$store.state.threejs.sysInit==false) return;

            var index =  this.$store.state.factory_select ;


            self.$store.dispatch('A_GetJson', self.$store.state.factories[index]).then(response =>{
                if(response.result !=='error')
                    {
                        if(response.meg ==='no Json')
                                return;
            
                        self.$store.state.factory_id = response.index;
                        var dxf_json = JSON.parse(response.meg);

                        //實例化
                        self.$store.state.threejs.DXFReader(dxf_json);

                        self.isloading = false;
                        self.$store.state.init_loadFactory =true;
                        //讀取工廠區域
                        self.$store.commit('LoadAreas');

                         setTimeout(()=>{
                             self.isloading = false;
                             self.$store.state.init_loadFactory =true;
                        //     //讀取需要排列棧板的資料
                            self.$store.dispatch('A_GetPallet_needSort').then(response =>{
                                if(response.result !=='error')
                                {
                                    self.$store.state.pallet_needsort = response;
                                }
                            });
                      
                            //讀取已有的棧板的資料
                            self.$store.dispatch('A_GetPallet_Exit_page').then(res_count =>{ 

                                var count = res_count.count;
                                //頁面
                                self.$store.state.pallet_exit=[];

                                 for(var i=0;i<count;i++)
                                 {
                                     //已有貨物資料讀取
                                    self.$store.dispatch('A_GetPallet_Exit',i+1).then(response =>{
                                        if(response.result !=='error')
                                        {   
                                               // console.log(response);

                                                response.forEach( function(e,index){
                                                        self.$store.state.pallet_exit.push(e);

                                                        //獲得area 的pos init
                                                        self.$store.dispatch('A_GetAreas_Posinit',e.id_areas).then(response2 =>{
                                                            var init_pos = JSON.parse(response2[0].pos_init);
                                                            var pos  =JSON.parse(e.pos);
                                                            self.$store.state.threejs.WH_FrameLess.CreateProject(index+1,e.id,init_pos,pos,'exit',e.id_areas,e.layout);
                                                        });
                                                });              
                                        }
                                    });
                                 }
                                


                                 self.$store.commit('WaitToPallet_needSort');
                            });

                            //讀取貨物設定資訊
                            self.$store.dispatch('A_GetProjects').then(response =>{
                              if(response.result !=='error')
                                {
                                    self.$store.state.projects = response;
                                }
                            });


                            // //讀取貨物設定資訊
                            // self.$store.dispatch('A_GetProjects').then(response =>{
                            //     if(response.result !=='error')
                            //       {
                            //           self.$store.state.projects = response;
                            //       }
                            //   });

                            //讀取棧板設定資訊
                              self.$store.dispatch('A_GetPallets').then(response =>{
                                if(response.result !=='error')
                                 {
                                     self.$store.state.pillets = response;
                                 }
                             });

                            },1000);

                    }
            });



        }
      }
}