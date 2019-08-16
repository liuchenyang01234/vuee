<template>
  <div style="width:100%">
    <el-autocomplete
      class="inline-input"
      v-model="searchM"
      placeholder="请输入经理编号或名称"
      :trigger-on-focus="false"
      style="margin-top:10px;margin-left: 10px"
      :fetch-suggestions="querySearchFundbyManager"
      @select="ManagerIdNameSelect">
      <i class="el-icon-search el-input__icon" slot="suffix" @click="searchManager"></i>
    </el-autocomplete>
    <div>
      <ElRow :span="23" style="margin-left:1%">
        <ElCol :span="8" style="margin-top:20px;" v-if="showAdd">
          <div  @click="addManager"
                style="margin:auto;background:#F6F6F8;text-align:center;height:283px;width:540px;line-height:287px;font-size:24px;">
            <i class="el-icon-plus" />
            添加经理人
          </div>
        </ElCol>
        <template v-for="(item,index) in tableData">
          <ElCol :span="8" style="margin-top:20px" :key="index">
            <el-card  :body-style="{ padding: '10px',height:'263px'}" style="width:540px;margin:auto;height: 287px">
              <!--style="margin:auto;border-style:solid;border-color:#F6F6F8;height:215px;width:400px;"-->
              <div >
                <!--style="height:155px;width:400px;padding-top:15px"-->
                <div style="height:200px;width:520px;">
                  <img v-if="item!=null"
                       :src=item.picture
                       height="200px" width="150px" style="float:left;margin-left:15px"/>
                  <span v-if="item!=null" style="margin-left:15px;font-size:18px;width:300px;height:20px">
                  {{item.name+(Array(4).join(0) + item.id).slice(-4)}}</span>
                  <!--:show-overflow-tooltip:true; @mouseover="overShow(item.introduce)" @mouseout="outHide"  -->
                  <div v-if="item!=null" class="msg"
                       style="margin-left:15px;margin-top:5px;font-size:18px;width:330px;white-space:normal;
                  word-break:break-all;overflow:hidden;float:left;height:115px">

                    <el-tooltip placement="bottom-start" class="item" effect="light">
                      <div class="text-wrapper" slot="content"> {{item.introduce}}</div>
                      <p  style="overflow: hidden;position:relative;margin: 0px;
                            -webkit-line-clamp: 4;
                             text-overflow:ellipsis;
                             -webkit-box-orient: vertical;
                             font-size:18px;
                             display: -webkit-box;">
                        {{item.introduce}}</p>
                    </el-tooltip>
                  </div>
                </div>
                <br>
                <div style="height:42px;width:520px" v-if="item!=null">
                  <el-button style="width:260px;margin:0px;float:left" @click="editManager(item)">
                    <i class="el-icon-edit"></i>编辑
                  </el-button>
                  <el-button style="width:260px;margin:0px;float:left" @click="deleteManager(item,index)">
                    <i class="el-icon-delete"></i>删除
                  </el-button>
                </div>
              </div>
            </el-card>
          </ElCol>
        </template>
      </ElRow>

    </div>
    <div style="margin-left:46%;margin-top: 15px"><!--   :total="total"-->
      <el-row>
        <el-col :span="4">
          <div style="font:16px Microsoft YaHei;padding:0 12px 0 6px;text-align: center;vertical-align: center;margin:5px;margin-top:7px">
            共{{total}}条</div>
        </el-col>
        <el-col :span="4">
          <div>
            <el-pagination   @current-change="handleCurrentChange"
                             :current-page.sync="currentPage"  :page-size="pageSzie"   :page-count="pageCount"
                             layout="total, prev, pager, next">
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import ElRow from "element-ui/packages/row/src/row";
  import ElCol from "element-ui/packages/col/src/col";
  import AxiosService from "@/utils/request.js";
  import {getBLen} from "@/utils/validate.js";
  export default {
    name: "managerlist",
    components: { ElRow, ElCol },
    data() {
      return {
        intShow:false,
        showAdd:true,
        tableData: [], //数据列表
        currentPage: 1, //默认显示第一页
        pageSzie: 6, //默认每页显示6条
        pageCount:1,
        total: 0, //总页数
        searchM: "",
        queryM:{
          id:'',
          name:''
        },
        //如果没有搜索条件 0  全局搜索   如果最后点击的是经理搜索按钮  searchOne=2  对应的条件是searchM  方法是  searchManager
        //  如果是下拉经理则是4    方法 querySearchFundbyManager   ManagerIdNameSelect
        searchOne:0,

      };
    },
    created() {
      this.Search(this.currentPage);
    },
    watch: {
      //确保tableData的长度为页码
      tableData: {
        handler (newValue, oldValue) {
          console.log("当前页得大小");
          console.log(this.pageSzie);
          if(this.currentPage==1)
            for(let i=newValue.length;i<5;i++)
            {
              newValue.push(null);
            }
          else
          {
            for(let i=newValue.length;i<this.pageSzie;i++)
              newValue.push(null);
          }
        },
        deep: true
      }
    },
    mounted() {},

    methods: {
      addManager() {
        this.$router.push({name: "addManager"});
      },
      editManager(item) {
        this.$store.commit("setManager",item);
        this.$router.push({name: "editManager", params: { id: item.id }});
        /*   //获得权限
           var role=this.$store.getters.role;
           console.log(role);
           if(role=="admin")
           {
             var managerid=item.id;
             alert("有权限");
             this.$store.commit("setManager",item);
             this.$router.push({name: "editManager", params: { id: item.id }});
           }
           else
             alert("没有权限");*/
      },
      deleteManager(item,index) {
        AxiosService({
          method: 'post',
          url: '/getUserRolebyToken'
        }).then((response) => {
          if (response.data.code == 200) {
            var managerid=item.id;
            this.$confirm("确定删除经理人吗", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
                AxiosService({
                  method: "post",
                  url:"/DelManagerbyId",  //删除
                  params: {
                    id:managerid,},
                }).then(res => {
                    if(res.data.code==200)
                    {
                      this.tableData.splice(index,1);
                      this.$message({
                        type: "success",
                        message: "删除成功!"
                      });
                      //zaiqingqiu benye
                      switch(this.searchOne){
                        case 0:
                          this.Search(this.currentPage);
                        case 2:
                          this.loadDataByManager(this.searchM);
                          break;
                        case 4: {
                          console.log("执行页码变化的4");
                          this.searchManagerByIdAndName(this.queryM.id,this.queryM.name);
                        }
                          break;
                      }

                    }
                  }).catch(err => {   // catch对应请求失败处理 比如访问不存在的url 或者缺少参数
                  console.log(err);});
              }).catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消删除"
                });
              });
          } else {
            Message({
              message: '没有权限',
              type: 'error',
              duration: 5 * 1000
            })
            return ;
          } }).catch((err) => {
          console.log(err)
        });
      },
      //超出长度显示...
      filterLength(value){
        if(value&&getBLen(value)>=1000)
        {
          value= value.substring(0,40)+'…';
        }
        return value;
      },
      SetCurrentPagePageSize(currentPage)
      {
        this.pageCount=Math.ceil((this.total+1)/6);
        // this.pageCount=(this.total+1)/6;
        if(currentPage==1)
          this.showAdd=true;
        else
          this.showAdd=false;
      },
      //全局查询  参数为当前页
      Search(currentPage)
      {
        AxiosService({
          method: "post",
          url:"getManagerbyIdNameParameter",
          params: {
            currentPage:currentPage,
          },
        })
          .then(res => {
            if(res.data.code==200)
            {
              var datanow=res.data.data;
              this.tableData = datanow.data;
              this.total = datanow.total;
              this.SetCurrentPagePageSize(currentPage);
            }
          }).catch(err => {   // catch对应请求失败处理 比如访问不存在的url 或者缺少参数
          console.log(err);});
      },
      //根据经理id或者name查询   查询的是经理  返回模糊查询的结果
      async querySearchFundbyManager(queryString, cb) {
        console.log("queryString");
        console.log(queryString);
        this.FuzzySerachlist=[];
        let res= await this.loadDataMohuserachbyManager(queryString);
        cb(this.FuzzySerachlist);
      },
      loadDataMohuserachbyManager: function(parameter){
        return new Promise((resolve,reject) => {
          AxiosService({
            method: 'get',
            url: "/querySearchMangerbyIdName",
            params: {       //params传递的参数被@RequestParam接收
              parameter:parameter
            },
          }).then((response) => {  //请求成功的时候 有返回或者发生异常
            var datanow=response.data.data;
            for (let i of datanow)
              i.value = (Array(4).join(0) + i.id).slice(-4)+i.name;
            this.FuzzySerachlist=datanow;
            resolve(response);
          }).catch((err) => {      // catch对应请求失败处理 比如访问不存在的url 或者缺少参数
            console.log(err);
            console.log('manager网络错误');
            this.FuzzySerachlist=[];
          });
        })
      },
      //参数item是类manager  查询的是基金
      ManagerIdNameSelect(item) {
        this.searchOne=4;
        this.queryM.id=item.id;
        this.queryM.name=item.name;
        this.currentPage=1;       //返回首页
        this.searchManagerByIdAndName(this.queryM.id,this.queryM.name);

      },
      //搜索  当前页面应该为1
      searchManager: function(){
        this.searchOne=2;
        this.currentPage=1;
        console.log(this.searchM);
        this.loadDataByManager(this.searchM);

      },
      //根据经理人字段id或者name搜索数据
      loadDataByManager: function(parameter){
        AxiosService({
          method: 'get',
          url: "/getManagerbyIdNameParameter",
          params: {
            parameter:parameter,
            currentPage:this.currentPage,
          },
        }).then((response) => {
          if(response.data.code==200) {
            var datanow = response.data.data;
            this.tableData = datanow.data;
            this.total = datanow.total;
            this.SetCurrentPagePageSize(this.currentPage);
          }
        }).catch((err) => {      // catch对应请求失败处理 比如访问不存在的url 或者缺少参数
          console.log(err);console.log('failed');
        });
      },
      //根据经理人字段id和name搜索数据
      searchManagerByIdAndName:function(id,name){
        AxiosService({
          method: 'post',
          url: '/getManagerbyIdNameParameter',
          params: {
            id:id,
            name:name,
            currentPage:this.currentPage,
          },
        }).then((response) => {
          if(response.data.code==200)
          {
            var datanow=response.data.data;
            this.tableData =datanow.data;
            this.total =datanow.total;
            this.SetCurrentPagePageSize(this.currentPage);
          }
        }).catch((err) => {console.log(err)});
      },

      //页码变更的时候 定义搜索
      handleCurrentChange(val) {
        this.currentPage = val; //动态改变
        switch(this.searchOne){
          case 0:
            this.Search(this.currentPage);
          case 2:
            this.loadDataByManager(this.searchM);
            break;
          case 4: {
            console.log("执行页码变化的4");
            this.searchManagerByIdAndName(this.queryM.id,this.queryM.name);
          }
            break;
        }

      }
    }
  };
</script>
<style>
  .hid {
    width: 370px;
    height: 59px;
    overflow: hidden;
    display: inline-block;
  }
  .hid:hover{
    overflow: visible;
  }
  .content{
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width:520px;
  }
  .msg{
    width: 520px;
    position: relative;
  }
  .msg a{
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    line-height: 20px;
    -webkit-line-clamp: 4;
  }
  .text-wrapper{
    /*color: red;*/
    Font:18px "Microsoft YaHei";
    text-overflow: ellipsis;
    display: inline-block;
    max-width: 300px;
    word-break: break-all;
    cursor: pointer;
  }
</style>

<style lang="scss">
  .el-card__body {
    padding: 0px;
  }
</style>

