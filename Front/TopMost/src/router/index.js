import Vue from 'vue'
import VueRouter from 'vue-router'
//第一步 導入組件
import System_Main from '@/components/System_Main.vue'


Vue.use(VueRouter)
var routes = [
    {
      path:'/',
      component: System_Main,
    },
    {
        path:'*',
        redirect:'/'
    },
    // {
    //   path:'/service',
    //   component: ServiceView,
    //   children:[
    //     {
    //         path:'tms',
    //         component: TMS,
    //         children:[
    //           {path:'', redirect:'status'},
    //           {path:'status', component: TMS_equipment_3D},
    //         ]
    //     }
    //   ]
    // }
  ]
//第四部  創建路由對象
var router = new VueRouter({
    mode: 'hash',
    routes
})

// //路由守衛
router.beforeEach((to,from,next) => {
    next();
  });


export default router
