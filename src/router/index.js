import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import { Message } from 'element-ui'
import AxiosService from '@/utils/request'
Vue.use(Router)
var router= new Router({
  mode: 'history',
  routes: [
     {
      path: '/first',
      name: 'first',
      component: () => import('@/views/first'),
      children:[
         {
          path: '/paging',
          name: 'paging',
        component: () => import('@/views/paging/paging'),
         meta: { title: '产品列表', icon: 'paging', noCache: true }
        },
         {
         path: '/ProductDetails',
          name: 'ProductDetails',
         component: () => import('@/views/paging/ProductDetails'),
          meta: { title: '产品详情', icon: 'ProductDetails', noCache: true }
        },
        {
         path: '/addProduct',
          name: 'addProduct',
        component: () => import('@/views/paging/addProduct'),
          meta: { title: '新增产品', icon: 'addProduct', noCache: true }
        },
        {
         path: '/editProduct',
          name: 'editProduct',
         component: () => import('@/views/paging/editProduct'),
          meta: { title: '编辑产品', icon: 'editProduct', noCache: true }
        },
        {
          path: '/managerList',
          name: 'managerlist',
          component: () => import('@/views/manager/managerList'),
          meta: { title: '经理人列表', icon: 'managerList', noCache: true }
        },
        {
          path: '/editManager',
          name: 'editManager',
          component: () => import('@/views/manager/editManager'),
          meta: { title: '编辑经理人', icon: 'editProduct', noCache: true }
        },
        {
          path: '/addManager',
          name: 'addManager',
          component: () => import('@/views/manager/addManager'),
          meta: { title: '添加经理人', icon: 'addManager', noCache: true }
        }
      ]
    },
     {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login/login'),
      meta: { title: '登录', icon: 'login', noCache: true }
    },
    {
      path: '/',
      redirect: '/login'
     /* component: login*/
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Login/register'),
      meta: { title: '注册', icon: 'register', noCache: true }
    }
  ]
})

router.beforeEach(function (to,from,next) {
  console.log(to);//到达的路由
  if(to.name!="login"&&to.name!="register")
  {
    if(store.getters.token==''||store.getters.token==null)
    {
      Message({
        message: '请登录',
        type: 'error',
        duration: 2 * 1000
      })
      router.push("/login")
      return
    }
  }
   if(to.name=="addProduct"||to.name=="editProduct"||to.name=="editManager"||to.name=="addManager") {
     AxiosService({
       method: 'post',
       url: '/getUserRolebyToken'
     }).then((response) => {
       if (response.data.code == 200) {
         next();
       } else {
         Message({
           message: '没有权限',
           type: 'error',
           duration: 5 * 1000
         })
         return ;
       }
       next();
     }).catch((err) => {
       console.log(err)
     });
   }
   else
   {
     next();
   }


  /*   if(store.getters.role=="admin")
       next();
     else
     {
       Message({
         message: '没有权限',
         type: 'error',
         duration: 5 * 1000
       })
          return
     }
   }
    next();   */
})

export default router
























