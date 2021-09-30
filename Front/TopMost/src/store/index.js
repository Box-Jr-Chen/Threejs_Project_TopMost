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
    baseUrlApi: process.env.VUE_APP_baseUrl,
    data_warehouse_Api: process.env.VUE_APP_baseUrl+process.env.VUE_APP_warehouse,
    data_area_Api: process.env.VUE_APP_baseUrl+process.env.VUE_APP_area,
    data_interval_Api: process.env.VUE_APP_baseUrl+process.env.VUE_APP_interval,
    data_sorting_project_Api: process.env.VUE_APP_baseUrl+process.env.VUE_APP_algs_sorting_project,
    setting_pillet_Api: process.env.VUE_APP_baseUrl+process.env.VUE_APP_setting_pillet,
    setting_project_Api: process.env.VUE_APP_baseUrl+process.env.VUE_APP_setting_project,
    setting_files_DXF_Api: process.env.VUE_APP_baseUrl+process.env.VUE_APP_getfiles_dxf,
    setting_json_DXF_Api: process.env.VUE_APP_baseUrl+process.env.VUE_APP_getjson_dxf,
    pallet_sort_Api: process.env.VUE_APP_baseUrl+process.env.VUE_APP_getpallet,
    pallet_exit_Api: process.env.VUE_APP_baseUrl+process.env.VUE_APP_getpallet_exit,
    pallet_exit_pagemax_Api: process.env.VUE_APP_baseUrl+process.env.VUE_APP_getpallet_exit_count,
    pallet_muliupdate_Api: process.env.VUE_APP_baseUrl+process.env.VUE_APP_pallet_update,
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
        'img':'project_edit_icon',
        'title':'貨物管理'
      },
      {
        'img':'sort_icon',
        'title':'貨物排列'
      },
      {
        'img':'area_icon',
        'title':'區域設定'
      },
      {
        'img':'pallet_icon',
        'title':'棧板設定'
      },
      {
        'img':'project_icon',
        'title':'貨物設定'
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
  area_show_afd: false,
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
  //需要排列棧板
  pallet_sort:[],
  //已排列棧板
  pallet_exit:[],
  //排列後的棧板
  pallet_sort_finish:[],
  isstart_sort: 0,   //0-未排列,1-排列中,2-排列完成
  select_Factory:false,

  //偵測棧板的計時器
  t_getpallet:null
  },



  mutations: {
    onWindowResize() {
      var self =this;

      self.state.threejs.camera.aspect = window.innerWidth / window.innerHeight;
      self.state.threejs.camera.updateProjectionMatrix();
    },

    //Pallet
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

     //Project
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

    //adfArea
    Show_Panel_adfArea(){
      this.state.area_show_afd= true;
    },
    Hide_Panel_adfArea(){
      this.state.area_show_afd= false;
    },
    //Area
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
        //z 要轉負
        this.state.addIns_pos.index = -1;
        this.state.addIns_pos.left.x = this.state.threejs.areas_ins_add[0].geometry.attributes.position.array[3];
        this.state.addIns_pos.left.z = -this.state.threejs.areas_ins_add[0].geometry.attributes.position.array[5];
        this.state.addIns_pos.right.x = this.state.threejs.areas_ins_add[0].geometry.attributes.position.array[15];
        this.state.addIns_pos.right.z = -this.state.threejs.areas_ins_add[0].geometry.attributes.position.array[17];
      }

    },
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

                       // console.log(element.borders);

                         //演算法 格子計算
                         var algs_grid = self.state.threejs.WH_FrameLess.Algs_grid(element.borders);
                         //演算法 方格中心計算
                         var algs_rectcenter = self.state.threejs.WH_FrameLess.Algs_RectCenter(algs_grid[0]);
                         
                        //判斷Area 是否需要重新計算
                        // if(element.width ===0 || element.length ===0|| element.pos_init ==="" ||element.interval!==self.state.threejs.WH_FrameLess.interval)
                         {
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
                                      if(response.result !==undefined)
                                      {
                                         // console.log("success :"+element.id);
                                      }
                              });
                 

                             //創建區域視覺
                             self.state.threejs.WH_FrameLess.createAreaLine(element.borders);
                             self.state.threejs.WH_FrameLess.CreateAreaGrid(algs_grid[0],algs_grid[1]);


                           //  console.log(self.state.threejs.WH_FrameLess.line_GROUP);

                        }

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

      if(self.state.pallet_sort <=0)
      {
        self.state.t_getpallet =setInterval(()=>{

                //API 讀取資料
            store.dispatch('A_GetPallet_needSort').then(response =>{
              if(response.result !=='error')
              {
                  store.state.pallet_sort = response;

                  if(store.state.pallet_sort.length >0)
                  {
                    self.$store.state.isstart_sort = 0;
                  }
                  if(store.state.pallet_sort.length >10)
                  {
                    clearInterval(self.state.t_getpallet); 
                  }
              }
            });
         },3000);
      }

    }

  },
  actions: {
        async AxiosGet(state, data) {
        return await axios.get(data.path).then(response => {
            return response.data;
        }).catch(error => {
            return error;
            //return Promise(error);
        })
        },
        async AxiosPost(state, data) {

        return await axios.post(data.path, data.form).then(response => {
            return response.data;
        }).catch(error => {
            return error;
        // return Promise.rejecte(error);
        })
        },
        async AxiosPatch(state, data) {  
        return await axios.patch(data.path, data.form).then(response => {
            return response.data;
        }).catch(error => {
            return Promise.rejecte(error);
        })
        },
        async AxiosDelete(state, data) {   
        return await axios.delete(data.path).then(response => {
            return response.data;
        }).catch(error => {
            return error;
        })
        },
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
        async A_Postsorting_project(state) {
          var self= this;

          var form = {
            "id_warehouse":self.state.factory_id
          };

          var data = {
            'path': self.state.data_sorting_project_Api,
            'form': form
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
        //Area Data
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

        //Pallets Data
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

        //Projects Data
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
               // console.log(response);
                return  response;
              }
              ).catch(error => {
                console.log(error);
                return error;
              });
        },
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
        //Factory
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
        //Json
        async A_GetJson(state,name){
          var self= this;
          var data = {
            'path': self.state.setting_json_DXF_Api+'?name='+name,
          };
          state

        //  console.log(data);

          return await store
              .dispatch('AxiosGet', data)
              .then(response => {
                return  response;
              }
              ).catch(error => {
                return error;
              });
        },

        //Pallet_needsort
        async A_GetPallet_needSort(state){
          var self= this;
          var data = {
            'path': self.state.pallet_sort_Api+'?id='+self.state.factory_id,
          };
          state

        //  console.log(data);

          return await store
              .dispatch('AxiosGet', data)
              .then(response => {
                return  response;
              }
              ).catch(error => {
                return error;
              });
        },

        //Pallet_exit
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
        //Pallet_exit_page
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
        //Pallet_exit
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

        //GetAreas Posinit
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

