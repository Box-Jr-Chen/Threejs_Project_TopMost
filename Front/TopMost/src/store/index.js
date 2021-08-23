// import axios from 'axios';
import Vue from 'vue';
import Vuex from 'vuex';
import ThreeJs from '@/components/ThreeJs/threejs.js';
Vue.use(Vuex)


export default  new Vuex.Store({
  state: {  
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
   WH_borders: 
   [
          [-420,     60],  //point1
          [-420,    -140],  //point2
          [ 320,    -140],  //point3
          [ 320,    60],   //point4
          [ 280,    60],   //point5
          [ 280,    200],   //point6
          [ 130,    200],   //point7
          [ 130,    60],   //point8
          [-420,    60],  //point9 back
   ],
   Areas_borders: 
   [
       {
           "area":"area_01",
           "vertices": [
               [-410,     50],  //point1
               [-410,    -130],  //point2
               [-200,    -130],  //point3
               [ -200,    50],   //point4
               [-410,     50]  //point5
           ]             
       },
       {
           "area":"area_02",
           "vertices": [
               [-160,     50],  //point1
               [-160,    -130],  //point2
               [20,    -130],  //point3
               [20,    50],   //point4
               [-160,     50]  //point5
           ]             
       },
       {
           "area":"area_03",
           "vertices": [
               [60,     50],  //point1
               [60,    -130],  //point2
               [280,    -130],  //point3
               [280,    50],   //point4
               [60,     50]  //point5
           ]             
       }
   ]

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
        // async AxiosGet(state, data) {
        // return await axios.get(data.path).then(response => {
        //     return response.data;
        // }).catch(error => {
        //     return error;
        //     //return Promise(error);
        // })
        // },
        // async AxiosPost(state, data) {


        // return await axios.post(data.path, data.form).then(response => {
        //     return response.data;
        // }).catch(error => {
        //     return error;
        // // return Promise.rejecte(error);
        // })
        // },
        // async AxiosPatch(state, data) {   //測試
        // return await axios.patch(data.path, data.form).then(response => {
        //     return response.data;
        // }).catch(error => {
        //     return Promise.rejecte(error);
        // })
        // },
        // async AxiosDelete(state, data) {   //測試
        // return await axios.delete(data.path).then(response => {
        //     return response.data;
        // }).catch(error => {
        //     return error;
        // })
        // },
        // async A_Login(state, data) {
        // var self= this;
        // var data_post = {
        //     'path': self.state.baseUrlApi + self.state.loginApi,
        //     'form': data
        // };
        // state
        // //console.log(data_post);
        // return await store
        //     .dispatch('AxiosPost', data_post)
        //     .then(response => {
        //         return  response;
        //     }
        //     ).catch(error => {
        //         return error;
        //     });
        // //return await this.AxiosPost(state, data);
        // }
  },
  modules: {

  },
})

