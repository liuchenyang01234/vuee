<template>
  <div  style="width:65%;">
    <h3 style="margin:20px">新增经理人</h3>
    <el-form
      label-suffix=":"
      label-width="150px"
      :rules="rules"
      ref="Manager"
      size="small"
      :model="Manager">
      <el-form-item label="姓名" prop="name" style="width:40%; " >
        <el-input v-model="Manager.name" style="widthz:100px" placeholder="请输入姓名不超过4个字"></el-input>
      </el-form-item>
      <el-form-item label="照片" prop="picture" style="width:70%;" :error="picMsg">
        <ImgSplit :ifShow="ifShow" :imgText="imgText" />
        <div style="margin-top: -10px">图片大小不超过500k</div>
      </el-form-item>
      <el-form-item label="个人介绍" prop="introduce" style="width:100%;">
        <el-input
          type="textarea"
          :rows="4"
          v-model="Manager.introduce"
          placeholder="请输入经理人个人介绍信息不超过200字"
        ></el-input>
      </el-form-item>
      <p
        style="text-align:right;margin-top:-20px;font-size:12px">
        {{Math.floor(getfieldlength(Manager.introduce)/2)}}/200</p>
    </el-form>
    <div style="margin-left:70%">
      <el-button style="margin-left:13px" @click="backToList()">取消</el-button>
      <el-button type="primary" style="margin-left:13px" @click="submitForm('Manager')">保存</el-button>
    </div>
    <br><br>
    <br><br>
    <br><br>
    <br><br>
  </div>
</template>

<script>
import AxiosService from "@/utils/request.js";
import ImgSplit from "@/components/ImgSplit";
import { validateManagerMamelength, getBLen, validatemessagelength} from "@/utils/validate.js";
export default {
  name: "editManager",
  components: { ImgSplit},
  data() {
    return {
      ifShow: true,
      imgText: "上传图片",
      nameMsg: "",
      picMsg: "",
      introducerMsg: "",
      Manager: {
        name: "",
        picture:'',
        introduce: ""
      },
      rules: {
        name: [
          //required 是否必填
          {required: true, message: "经理人名称不能为空"},
          {validator: validateManagerMamelength, trigger: "blur"}
        ],
        introduce: [
          {required: true, message: "介绍信息不能为空"},
          /* { type: 'number', message: '年龄必须为数字值'}*/
          {validator: validatemessagelength, trigger: "blur"}
        ],
      },
    }
  },
      created () {

      },
      methods: {
        getfieldlength (value) {
          return getBLen(value);
        },
        backToList () {
          this.$router.push({name: "managerlist"});
        },
        picChange () {
          if (this.Manager.picture.length === 0) {
            this.picMsg = "请正确导入图片";
          } else {
            this.picMsg = "";
          }
        },
        submitForm (formName) {
          this.Manager.picture=this.$store.getters.mpic;
          //然后判断
           this.picChange();
          console.log("aaaaa");
          console.log(this.Manager.picture);
          this.$refs[formName].validate(valid => {
            if (valid) {
              AxiosService({
                method: "post",
                url: "/AddManager", //api配置在config/index.js
                data: this.Manager
              })
                .then(response => {
                  //请求成功的时候 有返回或者发生异常
                  if(response.data.code==200)
                  {
                  this.$message({
                    message: "添加成功",
                    type: "success"
                  });
                  this.$router.push("/managerList");
                  }
                })
                .catch(err => {
                  console.log(err);
                });

              /*   alert('submit!');*/
            } else {
              console.log("error submit!!");
              return false;
            }
          })
        }


      }

};
</script>

<style scoped>
</style>
