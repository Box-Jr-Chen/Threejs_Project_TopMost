// import axios from 'axios';
import Vue from 'vue';
import Vuex from 'vuex';
import store from '@/store'
import ThreeJs from '@/components/ThreeJs/threejs.js';
import axios from 'axios';

Vue.use(Vuex)


export default  new Vuex.Store({
  state: {  
    //Api

    //根目錄
    baseUrlApi: process.env.VUE_APP_baseUrl,
    //倉儲API
    data_warehouse_Api: process.env.VUE_APP_baseUrl+process.env.VUE_APP_warehouse,
     //區域設定API
    data_area_Api: process.env.VUE_APP_baseUrl+process.env.VUE_APP_area,
    //演算法間隔API
    data_interval_Api: process.env.VUE_APP_baseUrl+process.env.VUE_APP_interval,
    //啟動演算法API
    data_sorting_project_Api: process.env.VUE_APP_baseUrl+process.env.VUE_APP_algs_sorting_project,
    data_sorting_project_single3_Api: process.env.VUE_APP_baseUrl+process.env.VUE_APP_algs_sorting_project_single3,
    //設定棧板資料API
    setting_pillet_Api: process.env.VUE_APP_baseUrl+process.env.VUE_APP_setting_pillet,
    //設定貨物資料API
    setting_project_Api: process.env.VUE_APP_baseUrl+process.env.VUE_APP_setting_project,
    //獲取地圖數量API
    setting_files_DXF_Api: process.env.VUE_APP_baseUrl+process.env.VUE_APP_getfiles_dxf,
    //獲取地圖資料API
    setting_json_DXF_Api: process.env.VUE_APP_baseUrl+process.env.VUE_APP_getjson_dxf,
    //獲取需要排列的棧板資料API
    pallet_sort_Api: process.env.VUE_APP_baseUrl+process.env.VUE_APP_getpallet,
    //獲取已排列的棧板資料API
    pallet_exit_Api: process.env.VUE_APP_baseUrl+process.env.VUE_APP_getpallet_exit,
    //獲取已排列的棧板資料的頁面數API
    pallet_exit_pagemax_Api: process.env.VUE_APP_baseUrl+process.env.VUE_APP_getpallet_exit_count,
    //棧板多重更新API
    pallet_muliupdate_Api: process.env.VUE_APP_baseUrl+process.env.VUE_APP_pallet_update,
    //棧板多重移除API
    pallet_muliremove_Api: process.env.VUE_APP_baseUrl+process.env.VUE_APP_pallet_remove,
    //獲取此區域初始(左下)位置API
    pallet_getPosinit_Api: process.env.VUE_APP_baseUrl+process.env.VUE_APP_area_posinit,
    



    //Main
    width_main:0,
    height_main:0,
    border_main:0,
    contain_rightpanel:null,
    threejs :ThreeJs.ThreeJs,
    panel_select:0,
    panel_show_addPallet_inSetting_Pallet:false,
    panel_show_deletePallet_inSetting_Pallet:false,
    panel_show_addPallet_inSetting_Project:false,
    panel_show_deletePallet_inSetting_Project:false,
    panel_show_deleteArea_inSet_Area:false,
    init_loadFactory:false,
    leftbtns:[
      {
        'img':'sort_icon',
        'title':'貨物排列'
      },
      {
        'img':'area_icon',
        'title':'區域設定'
      },
      //先移除棧板設定與貨物設定按鈕，不確定之後是否需要
      // {
      //   'img':'pallet_icon',
      //   'title':'棧板設定'
      // },
      // {
      //   'img':'project_icon',
      //   'title':'貨物設定'
      // },
      {
        'img':'project_edit_icon',
        'title':'貨物管理'
      },
    ],

   
   //棧板設定
   pillets:[],
   pillet_add_fix:{
    id:0,
    width:0,
    length:0,
    height:0,
   },
   pillet_delete:{
    id:0
   },
   pallet_error:'',
   //貨物設定
   projects:[],
   project_add_fix:{
    id:0,
    width:0,
    length:0,
    height:0,
   },
   project_delete:{
    id:0
   },
   project_error:'',

  //工廠設定
  factories:[],
  factory_id:0, //回傳的工廠ID 數字
  factory_select:0,

  //area區域
  areas:[],
  area_show_afd: false,  //是否顯示區域編輯或新增
  show_afd:false,
  afd_isAdd:false,
  addIns_pos:{
    'index':-1,
    'left':{
      'x':0,
      'z':0
    },
    'right':{
      'x':0,
      'z':0
    }
  },
  areas_delete:{
    id:0
  },

  //選定排列方式
  sort_selected:0,

  //需要排列棧板
  pallet_needsort:[],
  //已排列棧板
  pallet_exit:[],
  //排列後的棧板
  pallet_sort_finish:[],
  isstart_sort: 0,   //0-未排列,1-排列中,2-排列完成(面板順序)
  select_Factory:false, //是否有工廠
  isPalletManual:false, //是否手動修改棧板
  is_custom_enable:false, //是否手動修改棧板
  sort_err:"", //排列演算法是否有錯誤
  Manual_index :-1,
  Manual_error:"",
  setTime_manual_err:null,
  setTime_sort_err:null,
  //偵測棧板的計時器
  t_getpallet:null,

  //3d區域
  is_3d_area:false,
  area_pro_data:[],
  select_show_data_num:-1


  },



  mutations: {
    //螢幕調整
    onWindowResize() {
      var self =this;

      self.state.threejs.camera.aspect = window.innerWidth / window.innerHeight;
      self.state.threejs.camera.updateProjectionMatrix();
    },

    //棧板設定資訊顯示
    Show_Panel_addPallet(){
      this.state.panel_show_addPallet_inSetting_Pallet= true;
    },
    Hide_Panel_addPallet(){
      this.state.panel_show_addPallet_inSetting_Pallet= false;
    },
    Show_Panel_deletePallet(){
      this.state.panel_show_deletePallet_inSetting_Pallet= true;
    },
    Hide_Panel_deletePallet(){
      this.state.panel_show_deletePallet_inSetting_Pallet= false;
    },

    //貨物設定資訊顯示
    Show_Panel_addProject(){
      this.state.panel_show_addPallet_inSetting_Project= true;
    },
    Hide_Panel_addProject(){
      this.state.panel_show_addPallet_inSetting_Project= false;
    },
    Show_Panel_deleteProject(){
      this.state.panel_show_deletePallet_inSetting_Project= true;
    },
    Hide_Panel_deleteProject(){
      this.state.panel_show_deletePallet_inSetting_Project= false;
    },

    //區域設定資訊顯示
    Show_Panel_adfArea(){
      this.state.area_show_afd= true;
    },
    Hide_Panel_adfArea(){
      this.state.area_show_afd= false;
    },

    //區域
    Show_Panel_deleteArea(){
      this.state.panel_show_deleteArea_inSet_Area= true;
    },
    Hide_Panel_deleteArea(){
      this.state.panel_show_deleteArea_inSet_Area= false;
    },
    Create_Ins_AddArea(){
      this.state.threejs.CreateArea_Add_01();

      if(this.state.threejs.areas_ins_add.length >0)
      {
        //z 要轉負(顯示的時候要將z座標轉-)
        this.state.addIns_pos.index = -1;
        this.state.addIns_pos.left.x  =  this.state.threejs.areas_ins_add[0].geometry.attributes.position.array[3];
        this.state.addIns_pos.left.z  = -this.state.threejs.areas_ins_add[0].geometry.attributes.position.array[5];
        this.state.addIns_pos.right.x =  this.state.threejs.areas_ins_add[0].geometry.attributes.position.array[15];
        this.state.addIns_pos.right.z = -this.state.threejs.areas_ins_add[0].geometry.attributes.position.array[17];
      }

    },
    //讀取區域資訊
    LoadAreas(){
      var self =this;

      //清除區域
      if(self.state.areas.length>0)
      {
          for(var i=0;i<self.state.areas.length;i++)
          {
            self.state.areas[i] =null;
          }
      }
      self.state.areas = [];
      //清除區域視覺實體化
      self.state.threejs.WH_FrameLess.deleteAreaInstance();


      //API 讀取資料
      store.dispatch('A_GetArea').then(response =>{
          if(response.result !=='error')
            {
              self.state.areas =response;


              //創建視覺化區域
              self.state.areas.forEach(
                function(element) {
                    if(element.borders !=="")
                    {
                        element.borders      =  JSON.parse(element.borders);


                         //演算法 格子計算
                         var algs_grid = self.state.threejs.WH_FrameLess.Algs_grid(element.borders);
                         //演算法 方格中心計算
                         var algs_rectcenter = self.state.threejs.WH_FrameLess.Algs_RectCenter(algs_grid[0]);
                      
                        //找到長高與初始位置 重新上傳資料庫
                         element.width = algs_rectcenter.length;
                          element.length = algs_rectcenter[0].length;

                            var pos = algs_rectcenter[0][0];

                          element.pos_init ="["+pos[0]+","+pos[1]+"]";
                          element.rect = algs_rectcenter;
                          var borderstr = JSON.stringify(element.borders);
                  
                          //更新area資料 因為width和lengh 需要更新
                          var data={
                              id:element.id,
                              id_warehouse:element.id_warehouse,
                              title:element.title,
                              borders:borderstr,
                              width:element.width,
                              length:element.length,
                              pos_init:element.pos_init,
                              interval:self.state.threejs.WH_FrameLess.interval
                          };


                          //區域更新
                          store.dispatch('A_UpdateArea',data).then(response =>{
                            response
                          });

                          //創建區域視覺
                          self.state.threejs.WH_FrameLess.createAreaLine(element.borders);
                          self.state.threejs.WH_FrameLess.CreateAreaGrid(element.id,algs_grid[0],algs_grid[1]);
                      
                          self.state.threejs.WH_FrameLess.line_GROUP_rectpos.push(algs_rectcenter);

                    }
                }
              );


            }

        });
    },
    //判斷當沒有棧板需要排列時啟動偵測器等待幾秒讀取有沒有棧板要放，有停止偵測器
    WaitToPallet_needSort()
    {
      var self =this;

      if(self.state.pallet_needsort <=0)
      {
        self.state.t_getpallet =setInterval(()=>{

                //API 讀取資料
            store.dispatch('A_GetPallet_needSort').then(response =>{
              if(response.result !=='error')
              {
                  store.state.pallet_needsort = response;

                  //只要有就停住 以免影響排列
                  if(store.state.pallet_needsort.length >0)
                  {
                    self.state.isstart_sort = 0;
                    self.state.is_custom_enable = false;
                    self.state.isPalletManual= false; 
                    clearInterval(self.state.t_getpallet); 
                  }
              }
            });
         },3000);
      }

    },
    //刪除棧板(在3D Area裡面)
    selectPro_delete(state, index)
    {
      var self =this;
      self.state.area_pro_data[index].select_delete = !self.state.area_pro_data[index].select_delete;
      Vue.set(self.state.area_pro_data, index,self.state.area_pro_data[index]);
    
      self.state.threejs.Threejs_Area.pro_ins.forEach(e=>{
          if(e.name ==self.state.area_pro_data[index].id)
          {
            if(self.state.area_pro_data[index].select_delete)
                  self.state.threejs.Threejs_Area.SetProject_Select(e);
            else
                  self.state.threejs.Threejs_Area.SetProject_UnSelect(e);


            return;
          }
      });

    },
    sort_delete(state){
      state
      var self =this;

      self.state.threejs.WH_FrameLess.DeleteProject_sort();

      self.state.pallet_sort_finish.splice(0, self.state.pallet_sort_finish.length);
      self.state.pallet_sort_finish =[];

      self.state.isstart_sort =0; 
      self.state.isPalletManual =false;
    }
  },
  actions: {
        //Get 方法
        async AxiosGet(state, data) {
        return await axios.get(data.path).then(response => {
            return response.data;
        }).catch(error => {
            return error;
        })
        },
        //Post 方法
        async AxiosPost(state, data) {

        return await axios.post(data.path, data.form).then(response => {
            return response.data;
        }).catch(error => {
            return error;
        })
        },
        //Patch 方法
        async AxiosPatch(state, data) {  
        return await axios.patch(data.path, data.form).then(response => {
            return response.data;
        }).catch(error => {
            return Promise.rejecte(error);
        })
        },
        //Delete 方法
        async AxiosDelete(state, data) {   
        return await axios.delete(data.path).then(response => {
            return response.data;
        }).catch(error => {
            return error;
        })
        },

        //獲取地圖間格資訊
        async A_Getinterval(state) {
          var self= this;
          var data = {
            'path': self.state.data_interval_Api,
          };
          state
          return await store
              .dispatch('AxiosGet', data)
              .then(response => {
                return  response;
              }
              ).catch(error => {
                return error;
              });
        },
        //獲取需要排列的棧板
        async A_Postsorting_project(state) {
          var self= this;

          var form = {
            "id_warehouse":self.state.factory_id
          };
          
          var path =self.state.data_sorting_project_Api;

          if(self.state.sort_selected ==1)
          {
            path =self.state.data_sorting_project_single3_Api;
          }


          var data = {
            'path': path,
            'form': form
          };
          state
          return await store
            .dispatch('AxiosPost', data)
            .then(response => {
              return  response;
            }
            ).catch(error => {
              console.log(error);
              return error;
            });
        },
        //獲取倉儲資訊(已無用)
        async A_GetWarehouse(state) {
          var self= this;
          var data = {
            'path': self.state.data_warehouse_Api+"?id="+self.state.factory_id,
          };
          state
          return await store
              .dispatch('AxiosGet', data)
              .then(response => {
                return  response;
              }
              ).catch(error => {
                return error;
              });
        },
        //獲取需要倉儲內的地圖資訊
        async A_GetArea(state) {
          var self= this;
          var data = {
            'path': self.state.data_area_Api+"?id="+self.state.factory_id,
          };
          state
          return await store
              .dispatch('AxiosGet', data)
              .then(response => {
                return  response;
              }
              ).catch(error => {
                return error;
              });
        },
        //新增倉儲內的地圖資訊
        async A_PostArea(state, areadata) {
          var self= this;
          var data = {
            'path': self.state.data_area_Api,
            'form': areadata
          };
          state
          return await store
              .dispatch('AxiosPost', data)
              .then(response => {
                return  response;
              }
              ).catch(error => {
                return error;
              });
        },
        //更新倉儲內的地圖資訊
        async A_UpdateArea(state, areadata) {
          var self= this;
          var data = {
            'path': self.state.data_area_Api,
            'form': areadata
          };
          state
          return await store
              .dispatch('AxiosPatch', data)
              .then(response => {
                return  response;
              }
              ).catch(error => {
                return error;
              });
        },
        //刪除倉儲內的地圖資訊
        async A_DeleteArea(state, id) {
          var self= this;
          var data = {
            'path': self.state.data_area_Api+"?id="+id,
          };
          state
          return await store
              .dispatch('AxiosDelete', data)
              .then(response => {
                return  response;
              }
              ).catch(error => {
                return error;
              });
        },

        //讀取棧版設定資訊
        async A_GetPallets(state) {
          var self= this;
          var data = {
            'path': self.state.setting_pillet_Api,
          };
          state
          return await store
              .dispatch('AxiosGet', data)
              .then(response => {
                return  response;
              }
              ).catch(error => {
                return error;
              });
        },

        //新增棧版設定資訊
        async A_PostPallets(state,data_post) {
          var self= this;
          var data = {
            'path': self.state.setting_pillet_Api,
            'form': data_post,
          };
          state
          return await store
              .dispatch('AxiosPost', data)
              .then(response => {
                return  response;
              }
              ).catch(error => {
                return error;
              });
        },
        //更新棧版設定資訊
        async A_UpdatePallets(state,data_post) {
          var self= this;
          var data = {
            'path': self.state.setting_pillet_Api,
            'form': data_post,
          };
          state
          return await store
              .dispatch('AxiosPatch', data)
              .then(response => {
                return  response;
              }
              ).catch(error => {
                return error;
              });
        },
         //清除棧版設定資訊
        async A_DeletePallets(state,id) {
          var self= this;
          var data = {
            'path': self.state.setting_pillet_Api+"?id="+id,
          };
          state
          return await store
              .dispatch('AxiosDelete', data)
              .then(response => {
                return  response;
              }
              ).catch(error => {
                return error;
              });
        },

        //獲取貨物設定資訊
        async A_GetProjects(state) {
          var self= this;
          var data = {
            'path': self.state.setting_project_Api,
          };
          state
          return await store
              .dispatch('AxiosGet', data)
              .then(response => {
                return  response;
              }
              ).catch(error => {
                return error;
              });
        },

        //新增貨物設定資訊
        async A_PostProjects(state,data_post) {
          var self= this;
          var data = {
            'path': self.state.setting_project_Api,
            'form': data_post,
          };
          state
     
          return await store
              .dispatch('AxiosPost', data)
              .then(response => {
                return  response;
              }
              ).catch(error => {
                console.log(error);
                return error;
              });
        },

        //更新貨物設定資訊
        async A_UpdateProjects(state,data_post) {
          var self= this;
          var data = {
            'path': self.state.setting_project_Api,
            'form': data_post,
          };
          state
          return await store
              .dispatch('AxiosPatch', data)
              .then(response => {
                return  response;
              }
              ).catch(error => {
                return error;
              });
        },

        //清除貨物設定資訊
        async A_DeleteProjects(state,id) {
          var self= this;
          var data = {
            'path': self.state.setting_project_Api+"?id="+id,
          };
          state


          return await store
              .dispatch('AxiosDelete', data)
              .then(response => {
                return  response;
              }
              ).catch(error => {
                return error;
              });
        },

        //獲取倉儲資訊(無用)
        async A_GetFactories(state){
          var self= this;
          var data = {
            'path': self.state.setting_files_DXF_Api,
          };
          state
          return await store
              .dispatch('AxiosGet', data)
              .then(response => {
                return  response;
              }
              ).catch(error => {
                return error;
              });
        },
        //獲取倉儲 地圖 DXF Json 資訊
        async A_GetJson(state,name){
          var self= this;
          var data = {
            'path': self.state.setting_json_DXF_Api+'?name='+name,
          };
          state

          return await store
              .dispatch('AxiosGet', data)
              .then(response => {
                return  response;
              }
              ).catch(error => {
                return error;
              });
        },

        //獲取需要排列的棧板
        async A_GetPallet_needSort(state){
          var self= this;
          var data = {
            'path': self.state.pallet_sort_Api+'?id='+self.state.factory_id,
          };
          state

          return await store
              .dispatch('AxiosGet', data)
              .then(response => {
                return  response;
              }
              ).catch(error => {
                return error;
              });
        },

        //獲取已存在的棧板
        async A_GetPallet_Exit(state,page){
          var self= this;
          var data = {
            'path': self.state.pallet_exit_Api+'?id='+self.state.factory_id+'&page='+page,
          };
          state

          return await store
              .dispatch('AxiosGet', data)
              .then(response => {
                return  response;
              }
              ).catch(error => {
                return error;
              });
        },

        //獲取已存在的棧板數量頁面
        async A_GetPallet_Exit_page(state){
          var self= this;
          var data = {
            'path': self.state.pallet_exit_pagemax_Api+'?id='+self.state.factory_id,
          };
          state

          return await store
              .dispatch('AxiosGet', data)
              .then(response => {
                return  response;
              }
              ).catch(error => {
                return error;
              });
        },

        //更新演算法排列的多重棧板
        async A_UpdatePallet_muliti(state,data_muli){
          var self= this;

          var data = {
            'path':  self.state.pallet_muliupdate_Api,
            'form': data_muli
          };
          state
          return await store
              .dispatch('AxiosPatch', data)
              .then(response => {
                return  response;
              }
              ).catch(error => {
                return error;
              });
        },

        //移除演算法排列的多重棧板
        async A_RemovePallet_muliti(state,data_muli){
          var self= this;

          var data = {
            'path':  self.state.pallet_muliremove_Api,
            'form': data_muli
          };
          state
          return await store
              .dispatch('AxiosPatch', data)
              .then(response => {
                return  response;
              }
              ).catch(error => {
                return error;
              });
        },

        //獲取地圖的初始位置
        async A_GetAreas_Posinit(state,id){
          var self= this;

          var data = {
            'path':  self.state.pallet_getPosinit_Api+"?id="+id,
          };
          state
          return await store
              .dispatch('AxiosGet', data)
              .then(response => {
                return  response;
              }
              ).catch(error => {
                return error;
              });
        }
  },
  modules: {

  },
})

