<template>
  <div id="fundlist" style="margin:10px;">
    <!--   与上一个标签的高度差 -->
    <div>
        <span>
		    <el-autocomplete class="inline-input" v-model="searchP" :fetch-suggestions="querySearchFundbyProduct"
                         placeholder="请输入产品编号或名称"   :trigger-on-focus="false"  @select="ProductNoNameSelect">
            <i class="el-icon-search el-input__icon" slot="suffix" @click="searchProduct"></i>
            </el-autocomplete>

 			<el-autocomplete class="inline-input" v-model="searchM" :fetch-suggestions="querySearchFundbyManager"
                       placeholder="请输入经理编号或名称"   :trigger-on-focus="false"  @select="ManagerIdNameSelect">
            <i class="el-icon-search el-input__icon" slot="suffix" @click="searchManager"></i>
            </el-autocomplete>
            <el-button type="primary" icon="el-icon-plus" @click="add" style="float:right">新增</el-button>
		  </span>
      <el-table :header-cell-style="{background:'#eef1f6',color:'#606266',width:'100%'}"
                ref="testTable"
                :data="tableData"
                class="fundlist-table"
                style="width:100%"
                @row-click="handleclick">
        <!--   点击按钮 实现跳转   sortable  show-overflow-tooltip  -->
        <el-table-column  prop="no" label="产品编号" align="center" width="234px">
          <template slot-scope="scope">
            <el-button style="font-size: 18px" type="text" @click=idclick(scope.row)>{{scope.row.no}}</el-button>
          </template>
        </el-table-column>

        <el-table-column prop="name"  label="名称" width="264px">  </el-table-column>
        <el-table-column prop="netWorth"  label="净值" align="right" width="204px"> </el-table-column>
        <el-table-column prop="spInvestment"  label="投资起点" align="right" width="234px">
          <template slot-scope="scope">  <!--|| scope.row.spInvestment=='' -->
            {{(scope.row.spInvestment==null )?'':(scope.row.spInvestment).toFixed(2)}}
          </template>

        </el-table-column>
        <el-table-column prop="sdRate" label="七日年化收益率" width="234px" align="right">
          <template slot-scope="scope">
            {{(scope.row.sdRate==null || scope.row.sdRate=='')?'':(scope.row.sdRate*100).toFixed(4)+'%'}}

          </template>
        </el-table-column>

        <el-table-column prop="manager.id" label="经理人工号" align="right" width="234px">
          <template slot-scope="scope">
            <!-- {{scope.row.manager.id==null}}-->
            {{(scope.row.manager.id==null || scope.row.manager.id=='')?'':(Array(4).join(0) + scope.row.manager.id).slice(-4)}}
            <!--  如果是空 则不显示-->
          </template>

        </el-table-column>
        <el-table-column prop="manager.name" label="经理人姓名" align="center" >
        </el-table-column>
        <el-table-column label="操作" align="center"  width="130px">
          <template slot-scope="scope">
            <!--    {{scope.row.id!='' && scope.row.id!=null}}-->
            <!--当产品的id不为空 则为真-->
            <i v-if="(scope.row.id!='' && scope.row.id!=null)" class="el-icon-edit" slot="suffix" @click="clickDiago(scope.row)"></i>
          </template>
        </el-table-column>
      </el-table>

      <!-- Form -->
      <el-dialog title="个人信息" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="ID" :label-width="formLabelWidth">
            <el-input v-model="form.id" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="姓名" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handDialog()">确 定</el-button>
        </div>
      </el-dialog>

      <div align="center">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
    </div>

  </div>

</template>
<style>
  /*  设置高度  */
  #fundlist .fundlist-table th{
    padding: 0 !important;
    height:40px;
  }
  #fundlist .fundlist-table	td{
    padding: 0 !important;
    height:60px;
  }
  #fundlist .el-select .el-input {
    width: 110px;
  }
  #fundlist .el-table .info-row {
    background: #c9e5f5;
  }
  .el-autocomplete-suggestion__wrap {
    max-height: 238px;
  }
  #fundlist  .el-table { font-size: 18px}
</style>
<script>
  import AxiosService from '@/utils/request.js';
  import {fund} from  '@/utils/fund.js';
  export default{
    name:"test",
    data(){
      return{	//表格当前页数据
        tableData: [],
        //多选数组
        multipleSelection: [],
        //搜索条件
        searchP:null,
        searchM:null,
        queryP:{
          no:null,
          name:null
        },
        queryM:{
          id:null,
          name:null
        },
        FuzzySerachlist:[],
        //如果没有搜索条件 0  全局搜索  如果最后点击的搜索条件是searchP  searchOne=1    如果最后点击的搜索条件是searchM  searchOne=2
        // 如果是下拉列表产品则是3   如果是下拉经理人则是4
        searchOne:0,
       // criteria: '',
        //下拉菜单选项
        select: '',
        //默认每页数据量
        pagesize: 10,
        //默认高亮行数据id
        highlightId: -1,
        //当前页码
        currentPage: 1,
        //查询的页码
        start: 1,
        //默认数据总数
        totalCount: 0,
        dialogFormVisible: false,  //编辑按钮 diago
        form: {
          id: '',
          name:''
        },
        formLabelWidth: '120px',
      }
    },
    watch: {
      //确保tableData的长度为页大小
      tableData: {
        handler (newValue, oldValue) {
          for(let i=newValue.length;i<this.pagesize;i++)
          {
            newValue.push(fund);
          }
        },
        deep: true
      }
    },
    methods: {
      //根据产品id或者name查询
      async querySearchFundbyProduct(queryString, cb) {
        this.FuzzySerachlist=[];
        console.log("queryString");
        console.log(queryString);
        let res=await this.loadDataMohuserachbyProduct(queryString);
        // 调用 callback 返回建议列表的数据
        cb(this.FuzzySerachlist);
      },
      loadDataMohuserachbyProduct: function(parameter){       //没有分页
        return new Promise((resolve,reject) => {
          AxiosService({
            method: 'get',
            url: "/querySearchFundbyProduct",
            params: {       //params传递的参数被@RequestParam接收
              parameter:parameter
            },
          }).then((response) => {  //请求成功的时候 有返回或者发生异常
            console.log(response);
            var datanow=response.data.data;
            for (let i of datanow)
              i.value = i.no+""+i.name;
            console.log("datanow");
            console.log(datanow);
            this.FuzzySerachlist=datanow;
            //console.log(this.results);
            resolve(response);
          }).catch((err) => {      // catch对应请求失败处理 比如访问不存在的url 或者缺少参数
            console.log(err);
            console.log('网络错误');
            this.FuzzySerachlist=[];
          });
        })
      },
      ProductNoNameSelect(item) {
        this.searchOne=3;
        this.queryP.no=item.no;
        this.queryP.name=item.name;
        //返回首页
        this.currentPage=1;
        console.log(item);
        this.getFundByFundIdNameParameter(this.queryP.no,this.queryP.name,null)
      },

      //根据经理id或者name查询   查询的是经理  不是产品
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
            //console.log(response);
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
        //返回首页
        this.currentPage=1;
        console.log("11");
        console.log(item);
        this.getFundByManagerIdNameParameter(this.queryM.id,this.queryM.name,null)
      },

      //点击行响应
      handleclick: function(row, event, column){
        //this.highlightId = row.id;
      },
      idclick: function(row)
      {
        //传过去的是基金的id  带索引
        var id=row.id;
        console.log(row.id);
        //this.$router.push("/Product");
        this.$store.dispatch("setfund",row);
        this.$router.push({ name: 'ProductDetails'})
        /*   this.$router.push({ name: 'ProductDetails', params: { id: row.id }});*/
        console.log("点击编号生效跳转");
        console.log(row.no);
      },

      //搜索  页面应该返回为1
      searchProduct: function(){
        this.searchOne=1;
        this.currentPage=1;
        console.log(this.searchP);
        this. getFundByFundIdNameParameter(null,null,this.searchP)

      },
      //搜索  页面应该返回为1
      searchManager: function(){
        this.searchOne=2;
        this.currentPage=1;
        console.log(this.searchM);
        this.getFundByManagerIdNameParameter(null,null,this.searchM)

      },
      //添加
      add: function(){
        //获得权限
        var role=this.$store.getters.role;
        console.log(role);
        this.$router.push("/addProduct");
      },

      //编辑2个内容
      handleEdit: function(index, row) {
        dialogFormVisible=true;
      },
      //编辑
      clickDiago:function(row){
        this.$store.dispatch("setfund",row);
        this.$router.push({ name: 'editProduct', params: { id: row.id }})
      },
       //从服务器根据基金的不同字段搜索数据
      getFundByFundIdNameParameter(no,name,parameter){
        if(no!=null&&name !== null)
        {
          AxiosService({
            method: 'post',
            url: '/getFundByProductNoNameParameter',       //api配置在config/index.js
            params: {       //params传递的参数被@RequestParam接收
              no:no,
              name:name,
              pageNum:this.currentPage,
              pageSize:this.pagesize
            },
          }).then((response) => {  //请求成功的时候 有返回或者发生异常
            console.log(response);
            var datanow=response.data.data;
            this.tableData =datanow.funddata;
            this.totalCount =datanow.number;
          }).catch((err) => {      // catch对应请求失败处理 比如访问不存在的url 或者缺少参数
            console.log(err)
          });
          return;
        } else  if(parameter!=null)
        {
          AxiosService({
            method: 'get',
            url: "/getFundByProductNoNameParameter",
            params: {       //params传递的参数被@RequestParam接收
              parameter:parameter,
              pageNum:this.currentPage,
              pageSize:this.pagesize
            },
          }).then((response) => {  //请求成功的时候 有返回或者发生异常
            var datanow=response.data.data;
            this.tableData =datanow.funddata;
            this.totalCount =datanow.number;
          }).catch((err) => {      // catch对应请求失败处理 比如访问不存在的url 或者缺少参数
            console.log(err);
            console.log(' getFundByProductNoNameParameter  failed');
          });
          return;
        }
        //不根据条件查询
        AxiosService({
          method: 'get',
          url: '/getFundByProductNoNameParameter',
          params: {
            pageNum:this.currentPage,
            pageSize:this.pagesize
          },
        }).then((response) => {
          var datanow=response.data.data;
          this.tableData = datanow.funddata;
          this.totalCount = datanow.number;
        }).catch((err) => {      // catch对应请求失败处理 比如访问不存在的url 或者缺少参数
          console.log(err)
        });
      },

      getFundByManagerIdNameParameter(id,name,parameter) {
        if (id != null && name !== null) {
          AxiosService({
            method: 'post',
            url: '/getFundByManagerIdNameParameter',       //api配置在config/index.js
            params: {       //params传递的参数被@RequestParam接收
              id: id,
              name: name,
              pageNum: this.currentPage,
              pageSize: this.pagesize
            },
          }).then((response) => {  //请求成功的时候 有返回或者发生异常
            var datanow = response.data.data;
            this.tableData = datanow.funddata;
            this.totalCount = datanow.number;
          }).catch((err) => {      // catch对应请求失败处理 比如访问不存在的url 或者缺少参数
            console.log(err)
          });
          return;
        }else if(parameter!=null)
        {
          AxiosService({
            method: 'get',
            url: "/getFundByManagerIdNameParameter",
            params: {       //params传递的参数被@RequestParam接收
              parameter:parameter,
              pageNum:this.currentPage,
              pageSize:this.pagesize
            },
          }).then((response) => {  //请求成功的时候 有返回或者发生异常
            var datanow=response.data.data;
            this.tableData =datanow.funddata;
            this.totalCount =datanow.number;
          }).catch((err) => {      // catch对应请求失败处理 比如访问不存在的url 或者缺少参数
            console.log(err);
            console.log(' getFundByManagerIdNameParameter  failed');
          });
          return;
        }
        //不根据条件查询
        AxiosService({
          method: 'get',
          url: '/getFundByManagerIdNameParameter',
          params: {
            pageNum:this.currentPage,
            pageSize:this.pagesize
          },
        }).then((response) => {
          var datanow=response.data.data;
          this.tableData = datanow.funddata;
          this.totalCount = datanow.number;
        }).catch((err) => {      // catch对应请求失败处理 比如访问不存在的url 或者缺少参数
          console.log(err)
        });
      },


      //每页显示数据量变更
      handleSizeChange: function(val) {
        this.pagesize = val;
        switch(this.searchOne){
          case 1:
            this. getFundByFundIdNameParameter(null,null,this.searchP)
            break;
          case 2:
            this.loadDataByManager(this.searchM, this.currentPage, this.pagesize);
            break;
          case 3:
            this.getFundByManagerIdNameParameter(this.queryP.no,this.queryP.name)
            break;
          case 4:
          {
            console.log("执行页码变化的4");
            this.getFundByManagerIdNameParameter(id,name,null)
          }
            break;
          default:
             this. getFundByFundIdNameParameter(null,null,null)
            ;
        }

      },

      //页码变更
      handleCurrentChange: function(val) {
        this.currentPage = val;
        switch(this.searchOne){
          case 1:
            this. getFundByFundIdNameParameter(null,null,this.searchP)
            break;
          case 2:
            this.getFundByManagerIdNameParameter(null,null,this.searchM)
            break;
          case 3:
            this. getFundByFundIdNameParameter(no,name,null)
            break;
          case 4:
          {
            console.log("执行页码变化的4");
            this.getFundByManagerIdNameParameter(this.queryM.id,this.queryM.name,null)
          }
            break;
          default:
             this. getFundByFundIdNameParameter(null,null,null)
            ;
        }
      }

    },
    mounted:function(){
      //给axios加token
      //  var token=this.$store.getters.token;
      //   console.log("token      "+token);
      //this.axios.defaults.headers['Admin-Token'] =token;
      this. getFundByFundIdNameParameter(null,null,null)  //需要触发的函数
    }

  };





</script>
