export default {
    name: 'system_WH_FrameLess',
     components:{
   },
   computed:{

   },
   data() {
       return {
         waitSysInit :null,
         waitToSort:null
       }
   },
   mounted() {
    var self= this;

    self.$store.state.threejs.WH_FrameLess.CreateProject([[1,5],[0,2],[4,7],[3,3]]);
    return;

    // //等待ThreeJs初始成功
    // self.waitSysInit =  setInterval(() => {
        
    //     if(self.$store.state.threejs.sysInit==false) return;

    //     //獲得倉儲資料
    //     self.$store.dispatch('A_GetWarehouse').then(response =>{

    //         //確認是否有資料
    //         if(response.id !==undefined)
    //         {
    //             self.$store.state.WH_borders.id = response.id;
    //             self.$store.state.WH_borders.title = response.title;
    //             self.$store.state.WH_borders.borders = JSON.parse(response.borders);

    //                 //創建倉儲視覺
    //             self.$store.state.threejs.WH_FrameLess.createWaveHouse(
    //                 self.$store.state.WH_borders.borders
    //             );


    //             //獲得interval
    //             self.$store.dispatch('A_Getinterval').then(response =>{
    //                 if(response.interval !==undefined)
    //                 {
    //                     //套上去
    //                     self.$store.state.threejs.WH_FrameLess.interval =  parseInt(response.interval);
    //                     //獲得區域資料
    //                     self.$store.dispatch('A_GetArea').then(response =>{

    //                         self.$store.state.Areas_borders.areas =[];
    //                             var data = response;
    //                             self.$store.state.Areas_borders.id_warehouse = data[0].id_warehouse;
    //                             self.$store.state.Areas_borders.title_wavehouse = data[0].warehouse.title;

    //                             //等待排列
    //                             var data_waittofinish = [];
    //                             data.forEach(element => {
    //                                 element
    //                                 data_waittofinish.push(false);
    //                             });

    //                             self.waitToSort =  setInterval(() => {
    //                                 console.log("check");
    //                                     var check = true;
    //                                     data_waittofinish.forEach(element => {
    //                                           if(element ===false)
    //                                            check = false;
    //                                     });
                                        
    //                                     if(check)
    //                                     {
    //                                         console.log("sort");
    //                                         self.sortPRoject_recommand();
    //                                         //排列
    //                                         clearInterval(self.waitToSort);
    //                                     }

    //                              },500);

    //                             //等待算出格數        
    //                             data.forEach(function(element,index) {
    //                                     if(element.borders !=="")
    //                                         element.borders      =  JSON.parse(element.borders);
                     
    //                                     //delete element['id_warehouse'];
    //                                     delete element['warehouse'];
    //                                     self.$store.state.Areas_borders.areas.push(element);
                                        
    //                                     //演算法 格子計算
    //                                     var algs_grid = self.$store.state.threejs.WH_FrameLess.Algs_grid(element.borders);
    //                                     //演算法 方格中心計算
    //                                     var algs_rectcenter = self.$store.state.threejs.WH_FrameLess.Algs_RectCenter(algs_grid[0]);
    //                                      if(element.width ===0 || element.length ===0|| element.pos_init ==="")
    //                                      {
    //                                          //console.log(algs_rectcenter[0][0]);
    //                                         //找到長高與初始位置 重新上傳資料庫
    //                                         element.width = algs_rectcenter.length;
    //                                         element.length = algs_rectcenter[0].length;

    //                                         var pos = algs_rectcenter[0][0];

    //                                         element.pos_init ="["+pos[0]+","+pos[1]+"]";
    //                                         element.rect = algs_rectcenter;
    //                                         var borderstr = JSON.stringify(element.borders);
    //                                         // var algs_rectcenterstr = JSON.stringify(algs_rectcenter);
    //                                         // var data_rect_usestr = JSON.stringify(data_rect_use);

    //                                         data={
    //                                             id:element.id,
    //                                             id_warehouse:element.id_warehouse,
    //                                             title:element.title,
    //                                             borders:borderstr,
    //                                             width:element.width,
    //                                             length:element.length,
    //                                             pos_init:element.pos_init
    //                                         };

    //                                         //區域更新
    //                                         self.$store.dispatch('A_UpdateArea',data).then(response =>{
    //                                                 if(response.result !==undefined)
    //                                                 {
    //                                                     console.log("success :"+element.id);

    //                                                     data_waittofinish[index] = true;
    //                                                 }
    //                                         });

    //                                      }
    //                                      else  //TODO做比對
    //                                      {
    //                                         console.log("比對");
    //                                         data_waittofinish[index] = true;
    //                                      }
    //                                     //創建區域視覺
    //                                     self.$store.state.threejs.WH_FrameLess.createAreaLine(element.borders);
    //                                     self.$store.state.threejs.WH_FrameLess.CreateAreaGrid(algs_grid[0],algs_grid[1]);
    //                             });

    //                             clearInterval(self.waitSysInit);
    //                     });

    //                 }
    //             });
    //         }


    //         clearInterval(self.waitSysInit);
    //     });





    // }, 500);


   },
   methods: {
      sortPRoject_recommand()
      {
            var self= this;
            self.$store.dispatch('A_Postsorting_project').then(response =>{
                if(response.result ===undefined)
                    return;

                if(response.result==="success")
                {
                    // console.log(response.cause);
                    self.$store.state.Project_sort = response.cause;
                }
            });
      }

   },
 }