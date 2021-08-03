// import axios from 'axios';
import Vue from 'vue';
import Vuex from 'vuex';
import ThreeJs from '@/components/ThreeJs/threejs.js';
import MapDesign from '@/components/ThreeJs/map.js';
Vue.use(Vuex)


export default  new Vuex.Store({
  state: {  
    width_main:0,
    height_main:0,
    threejs :ThreeJs.ThreeJs,
    MapDesign :MapDesign.Map,
  },
  mutations: {
    onWindowResize() {
      var self =this;

      self.state.threejs.camera.aspect = window.innerWidth / window.innerHeight;
      self.state.threejs.camera.updateProjectionMatrix();
    // self.state.threejs.camera.setSize(window.innerWidth, window.innerHeight);
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

