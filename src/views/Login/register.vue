<template>

  <div>

    <div id="top1" style="height:50px;width:100%;background-color:#194F87;">
      <el-row style="display:flex;justify-content: space-around;flex-direction:column;">
        <el-col style="color:white;padding:10px;font-size: 18px">基金产品管理系统</el-col>
      </el-row>
    </div>

    <div class="registerclass" id="login" style="vertical-align:middle;width:100%;height:100%;position: fixed;">

      <el-form :model="LoginForm" status-icon :rules="rules" ref="LoginForm" class="register-class">
        <div class="title-container" style=" text-align:center;">
          <h3>注册账号</h3>
        </div>
        <div class="link-top"></div>

        <el-form-item   prop="username" style="color:white;margin-top:20px">
          <el-input v-model="LoginForm.username" autocomplete="off" placeholder="请输入账号">
            <i slot="prefix" class="el-icon-user"></i>
          </el-input>

        </el-form-item>
        <el-form-item  prop="password">
          <el-input type="password" v-model="LoginForm.password" autocomplete="off" placeholder="请输入密码">
            <i slot="prefix" class="el-icon-lock"></i>
          </el-input>
        </el-form-item>
        <el-form-item  prop="checkPass">
          <el-input type="password" v-model="LoginForm.checkPass" autocomplete="off" placeholder="请再次输入密码">
            <i slot="prefix" class="el-icon-circle-check"></i>
          </el-input>
        </el-form-item>
        <br>
        <el-form-item>
          <el-button type="primary" @click="submitForm('LoginForm')" style="width: 100%">提交注册</el-button>
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
        /*if(value.length>10||value.length<2)
          callback(new Error('长度不能小于2或大于10'));*/
        callback();
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.LoginForm.checkPass !== '') {
            this.$refs.LoginForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.LoginForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        LoginForm: {
          username:'',
          password: '',
          checkPass:''
        },
        rules: {
          username: [
            { validator: validateusername, trigger: 'blur' }
          ],
          password: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var register=new Object();
            register.username=this.LoginForm.username;
            register.password=this.LoginForm.password;
            AxiosService({
              method: 'post',
              url: '/register',
              data: register,   // data传递的参数被@RequestBody接收   这是一个json字符串
            }).then((response) => {  //请求成功的时候 有返回或者发生异常
              if(response.data.code==409)
              {
                MessageBox.alert('该账号已存在，请重新输入账号', '错误', {
                  confirmButtonText: '确定',
                  type: 'error'
                })
                return Promise.reject('error')
              } else if(response.data.code==200)
              {
                this.$message({
                  message: "注册成功",
                  type: "success"
                });
                this.$router.push("/login");
              }
            })

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
  .register-class .el-form-item__label{color:#FFFFFF;}
  #login{background-image: url("../../assets/loginbackground.jpg");
    background-size:100%;}
  /*/assets/loginbackground.jpg"*/
  .register-class{
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
