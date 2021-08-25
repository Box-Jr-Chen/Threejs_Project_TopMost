export default {
    name: 'system_WH_FrameLess',
     components:{
   },
   computed:{

   },
   data() {
       return {
       }
   },
   mounted() {
    var self= this;

    //等待ThreeJs初始成功
    var waitSysInit =  setInterval(() => {
        
        if(self.$store.state.threejs.sysInit==false) return;

        //獲得倉儲資料
        self.$store.dispatch('A_GetWarehouse').then(response =>{

            //確認是否有資料
            if(response.id !==undefined)
            {
                self.$store.state.WH_borders.id = response.id;
                self.$store.state.WH_borders.title = response.title;
                self.$store.state.WH_borders.borders = JSON.parse(response.borders);

                    //創建倉儲視覺
                self.$store.state.threejs.WH_FrameLess.createWaveHouse(
                    self.$store.state.WH_borders.borders
                );


                //獲得interval
                self.$store.dispatch('A_Getinterval').then(response =>{
                    if(response.interval !==undefined)
                    {
                        //套上去
                        self.$store.state.threejs.WH_FrameLess.interval =  parseInt(response.interval);
                        //獲得區域資料
                        self.$store.dispatch('A_GetArea').then(response =>{

                            self.$store.state.Areas_borders.areas =[];
                                var data = response;
                                self.$store.state.Areas_borders.id_warehouse = data[0].id_warehouse;
                                self.$store.state.Areas_borders.title_wavehouse = data[0].warehouse.title;

                                data.forEach(element => {
                                        if(element.borders !=="")
                                            element.borders      =  JSON.parse(element.borders);
                     
                                        //delete element['id_warehouse'];
                                        delete element['warehouse'];
                                        self.$store.state.Areas_borders.areas.push(element);
                                        
                                        //演算法 格子計算
                                        var algs_grid = self.$store.state.threejs.WH_FrameLess.Algs_grid(element.borders);
                                        //演算法 方格中心計算
                                        var algs_rectcenter = self.$store.state.threejs.WH_FrameLess.Algs_RectCenter(algs_grid[0]);
                                         if(element.width ===0 || element.length ===0|| element.pos_init ==="")
                                         {
                                             //console.log(algs_rectcenter[0][0]);
                                            //找到長高與初始位置 重新上傳資料庫
                                            element.width = algs_rectcenter.length;
                                            element.length = algs_rectcenter[0].length;

                                            var pos = algs_rectcenter[0][0];

                                            element.pos_init ="["+pos[0]+","+pos[1]+"]";
                                            element.rect = algs_rectcenter;
                                            var borderstr = JSON.stringify(element.borders);
                                            // var algs_rectcenterstr = JSON.stringify(algs_rectcenter);
                                            // var data_rect_usestr = JSON.stringify(data_rect_use);

                                            data={
                                                id:element.id,
                                                id_warehouse:element.id_warehouse,
                                                title:element.title,
                                                borders:borderstr,
                                                width:element.width,
                                                length:element.length,
                                                pos_init:element.pos_init
                                            };

                                            // console.log(data);
                                            self.$store.dispatch('A_UpdateArea',data).then(response =>{
                                                    if(response.result !==undefined)
                                                    {
                                                        console.log("success :"+element.id);
                                                    }
                                            });


                                         }
                                         else  //TODO做比對
                                         {
                                            console.log("比對");
                                         }
                                        //創建區域視覺
                                        self.$store.state.threejs.WH_FrameLess.createAreaLine(element.borders);
                                        self.$store.state.threejs.WH_FrameLess.CreateAreaGrid(algs_grid[0],algs_grid[1]);
                                });

                                clearInterval(waitSysInit);
                        });
                    }
                });
            }


            clearInterval(waitSysInit);
        });





    }, 500);


   },
   methods: {


   },
 }