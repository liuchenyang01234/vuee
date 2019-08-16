<template>
  <div class="includeStyle" style="width:65%;">
    <h3 style="margin:20px">编辑经理人</h3>
    <el-form
      label-suffix=":"
      :model="Manager"
      :rules="rules"
      label-width="150px"
      ref="Manager">
      <el-form-item label="姓名" prop="name" style="width:40%; " >
                  {{Manager.name+(Array(4).join(0) + Manager.id).slice(-4)}}
      </el-form-item>
      <el-form-item label="照片" prop="picture" style="width:70%;" :error="picMsg">
        <!-- <img  height="145px" width="100px" /> -->
        <ImgSplit :imgUrl="Manager.picture" style="margin-left:13px" />
      </el-form-item>
      <el-form-item label="个人介绍" prop="introduce" style="width:100%;">
        <el-input
          type="textarea"
          :rows="4"
          v-model="Manager.introduce"
          placeholder="请输个人介绍不超过200字"
        ></el-input>
      </el-form-item>
      <p style="text-align:right;margin-top:-20px;font-size:12px">
        {{Math.floor(getfieldlength(Manager.introduce)/2)}}/200</p>
    </el-form>
    <br>
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
import ImgSplit from "@/components/replaceSplit";
import {
  getBLen,
  validatemessagelength
} from "@/utils/validate.js";
export default {
  name: "editManager",
  components: { ImgSplit },
  data() {
    return {
      Manager: {
        id: "",
        name: "",
        picture:'',
        introduce: ""
      },
      picMsg: "",
      rules: {
        introduce: [
          {required: true, message: "介绍信息不能为空"},
          {validator: validatemessagelength, trigger: "blur"}
        ],
      },
    };
  },
  created() {
    //根据经理人id初始化
    this.searchManagerbyId();
  },
  methods: {
    getfieldlength (value) {
      return getBLen(value);
    },
    searchManagerbyId() {
      var id = this.$store.getters.mid;
      AxiosService({
        method: "get",
        url: "/getManagerbyId",
        params: {
          id: id
        }
      })
        .then(response => {
          if (response.data.code == 200) {
            this.Manager = response.data.data;
          }
        })
        .catch(err => {
          console.log(err);
          console.log("failed");
        });
    },

    backToList() {
      this.$store.commit("setManageredit",1);
      this.$router.push({
        name: "managerlist"
      });
    },
    submitForm(formName) {
      var edit=this.$store.getters.medit;
      console.log("edit"+edit)
      if(edit==2)
      {
        this.Manager.picture=this.$store.getters.mpic;
        this.$store.commit("setManageredit",1);
      }
      console.log("this.Manager.picture"+this.Manager.picture)
      if (this.picMsg === "") {
        console.log("bbbbbb");
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          AxiosService({
            method: "post",
            url: "/UpdateManager", //api配置在config/index.js
            data: this.Manager
          })
            .then(response => {
              if (response.data.code == 200) {
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                this.$router.push({name: "managerlist"});
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
        else {
          console.log("error submit!!");
          return false;
        }
      })
    }
}
};
</script>

<style lang='scss'>
.includeStyle {
  .cropper-component .btn-box .btn {
    padding: 38px 42px;
    text-align: center;
    border-radius: 4px;
    background-color: #fafafa;
    color: #000;
    border: 1px dashed #e8e8e8;
    cursor: pointer;
    display: inline-block;
  }
}
</style>
