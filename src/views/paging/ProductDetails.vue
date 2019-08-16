<template>
  <div style="width:85%;" class="styleinClude" id="ProductDetails">
    <h3 style="margin:20px">产品详情</h3>
    <el-form label-suffix=":" label-width="150px">
      <el-form-item label="产品编号" prop="fund.id" style="width:70%;">{{fund.no}}</el-form-item>
      <el-form-item label="产品名称" prop="fund.name" style="width:70%;">{{fund.name}}</el-form-item>
      <el-form-item label="产品净值" prop="fund.netWorth" style="width:60%;">{{fund.netWorth}}元</el-form-item>
      <el-form-item label="投资起点" prop="fund.spInvestment" style="width:60%;">{{fund.spInvestment}}元</el-form-item>
      <el-form-item label="七日年化收益率" prop="fund.sdRate" style="width:60%;">{{(fund.sdRate*100).toFixed(4)}}%</el-form-item>

      <!-- style="line-height:23px;width:100%;white-space:normal; word-break:break-all;overflow:hidden;margin-bottom:20px"-->
      <el-form-item label="产品介绍信息" prop="fund.message" style="width:100%">
        <div
          style="line-height:23px;width:100%;white-space:normal; word-break:break-all;overflow:hidden;margin-bottom:0px;margin-top:12px"
        >{{fund.message}}</div>
      </el-form-item>
      <el-form-item label="经理人介绍" style="width:100%;">
        <div v-if="fund.manager!=null">
          <img :src="fund.manager.picture" height="200px" width="150px" />
          <div style="width:110px;text-align:center;margin-bottom:0px;margin-top:-20px">{{fund.manager.name}}
            {{(Array(4).join(0) + fund.manager.id).slice(-4)}}</div>
        </div>
        <div v-if="fund.manager!=null"
          style="width:100%;white-space:normal; word-break:break-all;overflow:hidden;line-height:23px;">

          <el-tooltip placement="bottom-start" class="el-tool" effect="light">
            <div class="textwrapper1" slot="content"> {{fund.manager.introduce}}</div>
          <p style="overflow: hidden;position:relative;margin: 0px;
          -webkit-line-clamp: 2;
          text-overflow:ellipsis;
          -webkit-box-orient: vertical;
          display: -webkit-box;">
            {{fund.manager.introduce}}</p>
          </el-tooltip>
         </div>

      </el-form-item>
      <el-form-item label="产品库存" prop="fund.number" style="width:100%;">{{fund.number}}份</el-form-item>
      <template v-if="fund.startTime">
        <el-form-item label="秒杀时间" prop="fund.startTime" style="width:100%;">
          {{fund.startTime}}&nbsp;&nbsp;-&nbsp;&nbsp;{{fund.endTime}}
          <!-- <span>剩余</span> -->
        </el-form-item>
    <br>
        <el-form-item style="width:100%;">
          <div style="width:100%;text-align:center">
            <el-button
              :disabled="seckillDis"
              type="primary"
              :style="buttonStyle"
              v-loading.fullscreen.lock="fullscreenLoading"
              :element-loading-text="loadingtext"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              @click="seckill()">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{seckillText}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
            <span style="color:red">
              <TimeResidue v-if="timeResidue" :seckillTime="fund.startTime" />
            </span>
          </div>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>
<style>
 #ProductDetails .el-form-item__label{ font-size: 18px}
 #ProductDetails .el-form-item__content{font-size: 18px}
   .textwrapper1{
    /*color: red;*/
    text-overflow: ellipsis;
    display: inline-block;
    max-width: 1000px;
    word-break: break-all;
    cursor: pointer;
     font-size: 18px;
  }
  #addProduct .el-input__inner {
    height: 30px;
  }
</style>
<script>
  import AxiosService from "@/utils/request.js";
  import TimeResidue from "@/components/time";
  export default {
    name: "ProductDetails",
    components: { TimeResidue },
    data() {
      return {
        fullscreenLoading:false,
        loadingtext:"秒杀中",
        timeResidue: false,  //是否显示倒计时
        seckillText: "",  //倒计时文案
        seckillDis: true,  //秒杀按钮禁用开关
        url:
          "https://www.easy-mock.com/mock/5d42eb8a6e25003505f96a7d/productDetails",
        //表单内容
        // buttonStyle: { background: "#2E6DD4", "border-color": "#2E6DD4" },
        buttonStyle: { background: "#666666", border: "#666666 1px solid" },  //按钮样式动态绑定
        fund:new Object(),
        time:''
      };
    },
    created() {
      setInterval(() => {
        this.timeComplate(), 0;
      });
      AxiosService({
        method: "post",
        url:"/getFundbyId",
        params: {
          id: this.$store.getters.fid
        }
      })
        .then(res => {
          if(res.data.code==200)
          this.fund = res.data.data;
          console.log("this.fund.number"+this.fund.number);
        })
        .catch(err => {
          console.log(err);
        });
    },
    mounted() {},
    methods: {
      //执行秒杀
      seckill() {
        this.time=new Date();
        this.fullscreenLoading = true;
        console.log(this.fund.id);
        AxiosService({
          method: "post",
          url: "/flashsale", //api配置在config/index.js
          params: {
            id: this.fund.id
          }
        })
          .then(res => {

            if(res.data.code==5010)
            {
              this.fullscreenLoading = false;
              this.$message({
                message: "访问太频繁",
                type: "error"
              });
              console.log("访问太频繁");
              return;
            }
            if (res.data.code === 5002) {
              this.fullscreenLoading = false;
              this.flashSaleEnd(0);
              this.$message({
                message: "秒杀失败",
                type: "error"
              });
              console.log("秒杀结束");

            } else if (res.data.code === 5001) {
              this.sendSeckill()
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      //查询秒杀结果
      sendSeckill() {
        AxiosService({
          method: "get",
          url: "/flashsaleResult",
          params: {
            id: this.fund.id
          }
        })
          .then(res => {

            var nowDate=new Date();
            var distance = nowDate.getTime() - this.time.getTime();
            console.log("distance"+distance);
            if (res.data.code === 5002) {
              this.fullscreenLoading = false;
              this.$message({
                message: "秒杀失败",
                type: "error"
              });
              this.fund.id=0;
            } else if (res.data.code === 5001) {
              var nowDate=new Date();
              var distance = nowDate.getTime() - this.time.getTime();
              if(distance>10000)
              {
                this.fullscreenLoading = false;
                this.$message({
                  message: "秒杀失败",
                  type: "error"
                });
                return;
              }
              this.loadingtext="排队中";
              this.sendSeckill();

            } else if (res.data.code === 200) {
              //接受库存
              this.flashSaleEnd(res.data.data);
              this.fullscreenLoading = false;
              //每次秒杀成功 库存应该减
              this.$message({
                message: "秒杀成功",
                type: "success"
              });
            }
          })
          .catch(err => {
            // catch对应请求失败处理 比如访问不存在的url 或者缺少参数
            console.log(err);
          });
      },
      flashSaleEnd(stock){
        if(stock!=null||stock>0)
        {
          this.fund.number=stock;
          console.log(this.fund.number);
        }


        if(stock<=0||stock==null)
        {
          this.fund.number=0;
          this.seckillText = "秒杀已结束";
          this.timeResidue = false;
          //按钮置灰
          this.buttonStyle.background = "#666666";
          this.buttonStyle.border = "#666666 1px solid";
        }

      },
      timeComplate() {
        //定义秒杀开始时间和结束时间
        var seckillTimeParse = new Date(this.fund.startTime);
        var seckillTimeEnd = new Date(this.fund.endTime);
         if(this.fund.number<=0)
         {
           this.seckillText = "秒杀已结束";
           this.timeResidue = false;
           this.seckillDis=true
           return;
         }
        //当前时间小于开始时间
        if (Date.now() < seckillTimeParse.getTime()) {
          this.seckillDis = true;  //禁用秒杀按钮
          this.buttonStyle.background = "#666666";
          this.buttonStyle.border = "#666666 1px solid";
          if (seckillTimeParse.getTime() - Date.now() > 1000 * 60 * 15) {
            //********************************************↑*****↑****↑**********
            //开始时间比当前时间晚15分钟以上 //  **********毫秒***秒***分钟**********
            this.seckillText = "秒杀未开始";
          } else if (seckillTimeParse.getTime() - Date.now() <= 1000 * 60 * 15) {
            //开始时间比当前时间晚15分钟以下
            this.seckillText = "立 即 秒 杀";
            this.timeResidue = true;
          }
        } else if (Date.now() >= seckillTimeParse.getTime() && Date.now() <= seckillTimeEnd.getTime()) {
          //当前时间大于开始时间  小于结束时间
          this.seckillDis = false; //***********按钮样式更改****置灰
          this.buttonStyle.background = "#2E6DD4";//**********变** */
          this.buttonStyle.border = "#2E6DD4 1px solid";  //*****色/***/
          this.seckillText = "立 即 秒 杀";  //按钮文案变更
        } else if (Date.now() > seckillTimeEnd.getTime()) {
          //当前时间大于结束时间
          this.seckillText = "秒杀已结束";
          this.seckillDis = true;
          this.buttonStyle.background = "#666666";
          this.buttonStyle.border = "#666666 1px solid";
        }
      }
    }
  };
</script>
<style lang="scss" >
  .styleinClude {
    .el-form-item {
      margin-bottom: 0px;
    }
  }
</style>

