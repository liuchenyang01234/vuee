<template>

  <div>

    <div id="top1" style="height:50px;width:100%;background-color:#194F87;">
      <el-row style="display:flex;justify-content: space-around;flex-direction:column;">
        <el-col style="color:white;padding:10px;font-size: 18px">基金产品管理系统</el-col>
      </el-row>
    </div>


    <div class="loginclass" id="login" style="width:100%;height:100%;position: fixed;">

   <el-form :model="LoginForm" status-icon :rules="rules" ref="LoginForm"  class="login-class" >
    <div class="title-container" style=" text-align:center;">
        <h3>账号密码登录</h3>
      </div>

     <div class="link-top"></div>

      <el-form-item   prop="username" style="color:white;margin-top:20px">
    <el-input v-model="LoginForm.username"  placeholder="请输入账号" autocomplete="off">
      <i slot="prefix" class="el-icon-user"></i>
    </el-input>
     </el-form-item>
      <el-form-item  prop="password">
       <el-input type="password" v-model="LoginForm.password" placeholder="请输入密码" autocomplete="off">
         <i slot="prefix" class="el-icon-lock"></i>
       </el-input>
  </el-form-item>
     <br>
  <el-form-item style=" text-align:center;">
    <el-button type="primary" @click="submitForm('LoginForm')"
               v-loading.fullscreen.lock="fullscreenLoading"
               element-loading-background="rgba(0, 0, 0, 0.7)"
               element-loading-text="登录中"
               style="width: 100%">
      登录
    </el-button>
    <router-link to="/register">没有账号？立即注册</router-link>
  </el-form-item>
</el-form>

    </div>
  </div>
</template>


<script>

import AxiosService from '../../utils/request'
import { Message, MessageBox } from 'element-ui'
  export default {
    name: 'login',
    data() {
      var validateusername = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('用户名不能为空'));
        };
         callback();
      };
      var validatepassword = (rule, value, callback) => {
        console.log(value);
        if (value === '') {
          callback(new Error('请输入密码'));
        } else
        /*if(value.length>10||value.length<2)
          callback(new Error('长度不能小于2或大于10'));*/
          callback();
        };

      return {
        fullscreenLoading:false,
        LoginForm: {
          username:'',
          password: ''
        },
        rules: {
          username: [
            { validator: validateusername, trigger: 'blur' }
          ],
          password: [
            { validator: validatepassword, trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.fullscreenLoading = true;
            AxiosService({
                    method: 'post',
                     url: '/login',
                    data: this.LoginForm,   // data传递的参数被@RequestBody接收   这是一个json字符串
                    }).then((response) => {  //请求成功的时候 有返回或者发生异常
                     this.fullscreenLoading = false;
                      console.log(response.data);
                      if(response.data.code==407)
                      {
                        MessageBox.alert('当前账号不存在，请先注册', '错误', {
                          confirmButtonText: '确定',
                          type: 'error'
                        })
                        return Promise.reject('error')
                      }else if (response.data.code == 408) {
                        MessageBox.alert('密码错误，请重新输入', '错误', {
                          confirmButtonText: '确定',
                          type: 'error'
                        })
                        this.LoginForm.password='';
                        return Promise.reject('error')
                      }
                      if(response.data.code==200)
                      {
                        console.log(response.data);
                        var datanow=response.data.data;
                        this.$store.commit("setuser",datanow);
                        //以后每次请求添加token
                        this.axios.defaults.headers['Admin-Token'] =datanow.token;
                         this.$router.push("/first");
                      }
                    }).catch(err => {
              this.fullscreenLoading = false;
              console.log(err);});
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
      }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  /*中间的过度的横线*/
  .link-top {
    width: 100%;
    height: 1px;
    border-top: solid #ACC0D8 1px;
  }
  a {
    text-decoration: none;
    color: #409EFF;
  }
  .router-link-active {
    text-decoration: none;
  }
  .login-class .el-form-item__label{color:#FFFFFF;}
#login{
  background-image: url("../../assets/loginbackground.jpg");
  background-size:100%;
}
/*/assets/loginbackground.jpg"*/
.login-class{
  width: 300px;
  min-width: 200px;
  /* width: 25%; */
  /* margin: auto;
  margin-top:200px; */
  padding: 20px 35px 25px 35px;
  margin: 120px auto;
  margin-right: 60px;
  float:right;
  background-color:white;


 /*  background-color:#2d3a4b; */
}

/*
.el-form-item__label{color:white}
#loginclass .el-form-item__label{color:#FFFFFF;}
 .title{
      text-align:center;
      font-size: 26px;
      font-weight: 400;
      color: #eee;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
} */

/*  .login{
 background-color:#2d3a4b;
 height:100%;
}
*/



</style>
