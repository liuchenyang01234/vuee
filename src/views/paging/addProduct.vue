<template>
  <div id="addProduct" style="width:65%;">
    <h3 style="margin:20px">新增产品</h3>
    <el-form
      size="medium"
      :model="FundForm"
      :rules="rules"
      ref="FundForm"
      label-width="160px"
      class="addProductel-class"
    >
      <el-form-item label="产品名称 :" prop="name" style="width:70%;">
        <el-input v-model="FundForm.name" placeholder="请输入产品名称最长不超过20个字"></el-input>
      </el-form-item>
      <el-form-item label="产品净值 :" prop="netWorth" style="width:60%;">
        <el-input v-model.trim="FundForm.netWorth" style="width:90%;" placeholder="请输入产品净值"></el-input>元
      </el-form-item>

      <el-form-item label="投资起点 :" prop="spInvestment" style="width:60%;">
        <el-input v-model="FundForm.spInvestment" style="width:90%;" placeholder="请输入产品投资起点"></el-input>元
      </el-form-item>

      <el-form-item label="七日年化收益率 :" prop="sdRate" style="width:60%;">
        <el-input v-model="FundForm.sdRate" style="width:90%;" placeholder="请输入产品七日年化收益率"></el-input>%
      </el-form-item>

      <el-form-item label="产品介绍信息 :" prop="message" style="width:100%;">
        <el-input type="textarea" :rows="4" v-model="FundForm.message" placeholder="请输入产品介绍不超过200字"></el-input>
      </el-form-item>
      <p
        style="text-align:right;margin-top:-20px;font-size:12px">
        {{Math.floor(getfieldlength(FundForm.message)/2)}}/200</p>

      <el-form-item label="经理人 :" prop="manager" style="width:60%;">
        <el-autocomplete
          class="inline-input"
          v-model="FundForm.manager"
          :fetch-suggestions="querySearchFundbyManager"
          placeholder="请输入经理编号或名称"
          :trigger-on-focus="false"
          @select="ManagerIdNameSelect"
        ></el-autocomplete>
      </el-form-item>


      <el-form-item label="产品库存 :" prop="number" style="width:60%;">
        <el-input v-model.number="FundForm.number" style="width:90%;" placeholder="请输入产品库存"></el-input>份
      </el-form-item>

      <el-row>
        <el-col :span="9">
          <el-form-item label="秒杀时间" prop="startTime">
            <el-date-picker type="datetime" placeholder="开始时间" v-model="FundForm.startTime" autocomplete="off"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :default-value="timeDefaultStartShow" @blur="click" style="width: 100%;" @change="TimeChange"> </el-date-picker>
          </el-form-item>
        </el-col>
        <!-- <div style="height:1px;background:#000000;width:20px;margin:20px 2px;float:left"></div>-->
        <el-col class="line" :span="1"><div style="margin-top:5px">————</div></el-col>
        <el-col :span="9">
          <el-form-item label-width="0px" prop="endTime">
            <el-date-picker type="datetime" placeholder="结束时间" v-model="FundForm.endTime" autocomplete="off"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :default-value="timeDefaultEndShow" @blur="click"  @change="TimeChange"> </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item>
        <el-button type="primary" style="float:right" @click="submitForm('FundForm')">保存</el-button>
        <el-button style="float:right" @click="resetForm('FundForm')">取消</el-button>
      </el-form-item>
    </el-form>
    <br>
    <br>
  </div>
</template>
<style lang="scss">
  .el-autocomplete-suggestion__wrap {
    max-height: 238px;
  }

  #addProduct .el-input__inner {
    height: 30px;
  }
  #addProduct .el-range-editor.el-input__inner {
    padding: 0px 10px;
    width: 50%;
  }
  #addProduct .el-date-editor .el-range-separator {
    padding: 0px 5px 5px;
  }
  #addProduct .el-col-24 {
    height: 40px;
  }

</style>
<script>
  import AxiosService from "@/utils/request.js";
  import {
    validatenamelength,
    getBLen,
    validateFloatingPoint,
    validateNNFloatingPoint,
    validatemessagelength
  } from "@/utils/validate.js";
  export default {
    data() {
      var validatestartTime = (rule, value, callback) => {
        if (value == null) {
          if (this.FundForm.endTime !== null) {

            callback(new Error('开始和结束时间必须同时填写或同时不填写'));
          }
        } else {
          //判断结束时间是否为空
          if (this.FundForm.endTime == null) {
            callback(new Error('开始和结束时间必须同时填写或同时不填'));
          }
          else if ( new Date(value).getTime() >=new Date(this.FundForm.endTime).getTime())
          {
            callback(new Error('开始时间不得大于等于结束时间'));
          }
        }
        callback();
      };
      var validateendTime = (rule, value, callback) => {
        this.$refs.FundForm.validateField('startTime');
        callback();
      };
      return {
        FuzzySerachlist: [],
        manager: {
          id: Number,
          name: ""
        },
        timeDefaultStartShow:new Date(),
        timeDefaultEndShow:new Date(),
        FundForm: {
          name: "",
          netWorth: "",
          sdRate: "",
          spInvestment: "",
          message: "",
          manager: "",
          number: "",
          startTime: null,
          endTime: null
        },
        rules: {
          name: [
            //required 是否必填
            { required: true, message: "产品名称不能为空" },
            { validator: validatenamelength, trigger: "blur" }
          ],
          netWorth: [
            { required: true, message: "产品净值不能为空" },
            /* { type: 'number', message: '年龄必须为数字值'}*/
            { validator: validateNNFloatingPoint, trigger: "blur" }
          ],
          sdRate: [
            { required: true, message: "七日年化收益率不能为空" },
            { validator: validateFloatingPoint, trigger: "blur" }
          ],
          spInvestment: [
            { required: true, message: "投资起点不能为空" },
            { validator: validateNNFloatingPoint, trigger: "blur" }
          ],
          message: [
            { required: true, message: "产品介绍信息不能为空" },
            { validator: validatemessagelength, trigger: "blur" }
          ],
          number: [
            { required: true, message: "产品库存不能为空" },
            { type: "number", message: "请输入整数", trigger: "blur" }
          ],
          //搜索条件
          manager: [{ required: true, message: "经理人不能为空" }],
          startTime: [  { validator: validatestartTime, trigger: "blur" }],
          endTime: [  { validator: validateendTime, trigger: "blur" }]
        }
      };
    },
    created(){
      console.log(this.FuzzySerachlist.length);
    },
    methods: {
      click(){
        this.timeDefaultStartShow=new Date();
        this.timeDefaultEndShow=new Date();
      },
      TimeChange(time) {
        this.$refs.FundForm.validateField('startTime');},
      getfieldlength(value) {
        return getBLen(value);
      },

      submitForm(formName) {
        console.log("aaa");
        this.$refs[formName].validate(valid => {
          if (valid) {
            //不需要id
            var fund=new Object();
            fund.name=this.FundForm.name;
            fund.netWorth=this.FundForm.netWorth;
            fund.sdRate=this.FundForm.sdRate/100;
            fund.spInvestment=this.FundForm.spInvestment;
            fund.message=this.FundForm.message;
            fund.number=this.FundForm.number;
            fund.startTime=this.FundForm.startTime;
            fund.endTime=this.FundForm.endTime;
            fund.manager=this.manager;
            AxiosService({
              method: "post",
              url: "/insertFund", //api配置在config/index.js
              data: fund
            })
              .then(response => {
                //请求成功的时候 有返回或者发生异常
                this.$message({
                  message: "添加成功",
                  type: "success"
                });
                this.$router.push("/paging");
                console.log(response);
              })
              .catch(err => {
                // catch对应请求失败处理 比如访问不存在的url 或者缺少参数
                console.log(err);
              });

            /*   alert('submit!');*/
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.$router.push("/paging");
      },
      //根据经理id或者name查询   查询的是经理
      async querySearchFundbyManager(queryString, cb) {
        console.log("queryString");
        console.log(queryString);
        this.FuzzySerachlist = [];

        let res = await this.loadDataMohuserachbyManager(queryString);
        if (this.FuzzySerachlist.length > 6) {
          this.BiggerSix = true;
        } else {
          this.BiggerSix = false;
        }
        cb(this.FuzzySerachlist);
      },
      loadDataMohuserachbyManager: function(parameter) {
        return new Promise((resolve, reject) => {
          AxiosService({
            method: "get",
            url: "/querySearchMangerbyIdName",
            params: {
              //params传递的参数被@RequestParam接收
              parameter: parameter
            }
          })
            .then(response => {
              //请求成功的时候 有返回或者发生异常
              //console.log(response);
              var datanow = response.data.data;
              for (let i of datanow)
                i.value = (Array(4).join(0) + i.id).slice(-4) + i.name;
              console.log("datanow");
              console.log(datanow);
              this.FuzzySerachlist = datanow;
              console.log(this.results);
              resolve(response);
            })
            .catch(err => {
              // catch对应请求失败处理 比如访问不存在的url 或者缺少参数
              console.log(err);
              console.log("manager网络错误");
              this.FuzzySerachlist = [];
            });
        });
      },
      //参数item是类manager
      ManagerIdNameSelect(item) {
        //返回首页   这里应该是经理的信息
        // this.currentPage=1;
        this.manager.id = item.id;
        this.manager.name = item.name;
        console.log("经理");
        console.log(item);
      }
    }
  };
</script>
