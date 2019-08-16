//封装的好处  具体页面专注于成功的结果 错误结果由request专门处理

import axios from 'axios'
import store from '@/store'
import { Message, MessageBox } from 'element-ui'
//import router from '../router'

//import router from '@/router'

// create an axios instance
// api  为http://localhost:8080
const AxiosService = axios.create({
  baseURL: "/api", // api的base_url
  timeout: 5000, // request timeout
  headers:{
  	"Content-Type": "application/json;charset=UTF-8",
    "crossDomain": true
  }
});

// request interceptor
AxiosService.interceptors.request.use(config => {
	console.log("执行了请求拦截器 ");
  // Do something before request is sent
  //给axios加token
  var token=store.getters.token;
  console.log("token11      "+token);
  config.headers['Admin-Token'] =token;// 让每个请求携带token-- ['Admin-Token']为自定义key 请根据实际情况自行修改
    return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
});


// respone interceptor
AxiosService.interceptors.response.use(
  response => {
    const res = response.data;
     if (res.code ==405) {
      MessageBox.alert('没有权限', '警告', {
        confirmButtonText: '确定',
        type: 'error'
      })
      return Promise.reject('error')
    } else if (res.code == 406) {
       MessageBox.alert('登录超时', '警告', {
        confirmButtonText: '确定',
        type: 'error'
      }).then(() => {
       			localStorage.removeItem("vuex");
                // router.push("/login");
                window.location.href='/login';
      })
      return Promise.reject('error')
    }else if (res.code == 510) {
      MessageBox.alert('服务端错误', '错误', {
        confirmButtonText: '确定',
        type: 'error'
      })
      return Promise.reject('error')
    }else if (res.code == 511) {
      MessageBox.alert('服务端绑定错误', '错误', {
        confirmButtonText: '确定',
        type: 'error'
      })
      return Promise.reject('error')
    }else if (res.code == 520) {
      MessageBox.alert('服务端未定义错误', '错误', {
        confirmButtonText: '确定',
        type: 'error'
      })
      return Promise.reject('error')
    }

    else {
      return response
    }
  }, (error) => {
    console.log('err' + error)// for debug
    Message({
      message: '登录连接超时（后台不能连接，请联系系统管理员）',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  });

export default AxiosService;
