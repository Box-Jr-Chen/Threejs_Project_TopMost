// import axios from 'axios';
import Vue from 'vue';
import Vuex from 'vuex';
import store from '@/store'
import ThreeJs from '@/components/ThreeJs/threejs.js';
import axios from 'axios';

Vue.use(Vuex)


export default  new Vuex.Store({
  state: {  
    baseUrlApi: process.env.VUE_APP_baseUrl,
    data_warehouse_Api: process.env.VUE_APP_baseUrl+process.env.VUE_APP_warehouse,
    data_area_Api: process.env.VUE_APP_baseUrl+process.env.VUE_APP_area,
    data_interval_Api: process.env.VUE_APP_baseUrl+process.env.VUE_APP_interval,
    data_sorting_project_Api: process.env.VUE_APP_baseUrl+process.env.VUE_APP_algs_sorting_project,
    setting_pillet_Api: process.env.VUE_APP_baseUrl+process.env.VUE_APP_setting_pillet,
    setting_project_Api: process.env.VUE_APP_baseUrl+process.env.VUE_APP_setting_project,
    id_getWavehouse:1,
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

    leftbtns:[
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
   //位置資訊
   WH_borders:{
     id :-1,
     title:"",
     borders:[]
   },
   Areas_borders: 
   {
    id_warehouse :-1,
     title_wavehouse:"",
     areas:   
     []
   },
   
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
  //排列後的棧板
  pillet_sort:null,

  },
  mutations: {
    onWindowResize() {
      var self =this;

      self.state.threejs.camera.aspect = window.innerWidth / window.innerHeight;
      self.state.threejs.camera.updateProjectionMatrix();
    },
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

        async A_GetWarehouse(state) {
          var self= this;
          var data = {
            'path': self.state.data_warehouse_Api+"?id="+self.state.id_getWavehouse,
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

        async A_GetArea(state) {
          var self= this;
          var data = {
            'path': self.state.data_area_Api+"?id="+self.state.id_getWavehouse,
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
            "id_warehouse":self.state.id_getWavehouse
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
                console.log(response);
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
  },
  modules: {

  },
})

