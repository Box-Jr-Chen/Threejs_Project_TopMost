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
    id_getWavehouse:1,
    width_main:0,
    height_main:0,
    border_main:0,
    contain_rightpanel:null,
    threejs :ThreeJs.ThreeJs,
    panel_select:0,
    panel_show_addPallet_inSetting_Pallet:false,
    panel_show_addPallet_inSetting_Project:false,
    leftbtns:[
      {
        'img':'setting',
        'title':'倉儲排列'
      },
      {
        'img':'setting',
        'title':'棧板設定'
      },
      {
        'img':'setting',
        'title':'貨物設定'
      },
      {
        'img':'setting',
        'title':'繪製地圖'
      }
    ],
   //位置資訊
   WH_borders:{
     id :-1,
     title:"",
     borders:[]
   } 
,
   Areas_borders: 
   {
     id_wavehouse :-1,
     title_wavehouse:"",
     areas:   
     []
   }


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
    Show_Panel_addProject(){
      this.state.panel_show_addPallet_inSetting_Project= true;
    },
    Hide_Panel_addProject(){
      this.state.panel_show_addPallet_inSetting_Project= false;
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
        async AxiosPatch(state, data) {   //測試
        return await axios.patch(data.path, data.form).then(response => {
            return response.data;
        }).catch(error => {
            return Promise.rejecte(error);
        })
        },
        async AxiosDelete(state, data) {   //測試
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
  },
  modules: {

  },
})

