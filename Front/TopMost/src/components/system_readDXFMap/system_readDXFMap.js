
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

                        self.isloading = true;

                        //讀取工廠區域
                        self.$store.commit('LoadAreas');

                        setTimeout(()=>{
                            self.isloading = false;
                            self.$store.state.init_loadFactory =true;


                            //讀取需要排列托盤的資料
                            self.$store.dispatch('A_GetPallet_Sort').then(response =>{
                                if(response.result !=='error')
                                {
                                    self.$store.state.pallet_sort = response;
                                }
                            });


                        },1000);

                    }
            });



        }
      }
}