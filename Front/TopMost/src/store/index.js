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

