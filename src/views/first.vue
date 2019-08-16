<!-- 首页 -->
<template>
	<div id="first" style="">
		<div id="top1">
	        <el-row style="display:flex;align-items:center;">
	  		 <el-col style="width:50%;color:white;font-size: 18px">基金产品管理系统</el-col>
	    		 <el-col style="text-align:right;color:white">
          <!--  <el-avatar icon="el-icon-user-solid"></el-avatar> -->
	    			<i class="el-icon-user-solid"></i>
	  			<!--  <el-button type="text" style="color:white">用户刘晨阳</el-button> -->
	  			 <el-button type="text"><usertabs></usertabs></el-button>
	    		 </el-col>
	  </el-row>
		</div>
   <!-- style="margin-bottom:10px"-->
	<el-tabs v-model="activeName" @tab-click="handleClick"  type="card">
    <el-tab-pane label="基金产品管理" name="1">
      <BreadCrumb></BreadCrumb>
    </el-tab-pane>

    <el-tab-pane label="经理信息管理" name="2">
      <ManagerBread></ManagerBread>
    </el-tab-pane>

  </el-tabs>
       <!-- 设置边界 -->
   <div style="border-style:solid;border-width:10px;border-color:#DCDFE6;">
     <router-view></router-view>
     <!--<keep-alive>

    </keep-alive>-->

    </div>
	</div>
</template>

<style>
#first .el-tabs--card>.el-tabs__header .el-tabs__item.is-active{
  background-color:#EF9207;
  color:white;
}


/*
el-tabs__item .is-active {
  background-color:black;}
*/

.el-select .el-input {
   width: 110px;
	}
.el-table .info-row {
    background: #c9e5f5;
    }
#top1 {
	  background:#194F87;
	  padding:5px;
	  overflow:hidden
      }
</style>

<script>
import usertabs from '@/views/usertabs';
import BreadCrumb from  '@/views/BreadCrumb';
import ManagerBread from '@/views/ManagerBread';

  export default {
    data() {
      return {
        activeName: '1'
      };
    },
	mounted:function(){
           //  document.querySelector('body').setAttribute('style', 'background-color:#FFFFFF');

           //  this.$router.push("/paging");

    },
  /*watch:{
  $route(to,from){
    console.log("first界面的路由变化 to.path");
    //console.log(to.path);
    if(to.path=="/first");
      console.log("to.path");
   // console.log(to.path);
   }
  },*/

    components: {
    	'usertabs':usertabs,
      'BreadCrumb':BreadCrumb,
      'ManagerBread':ManagerBread
    },
    methods: {
      handleClick(tab, event) {
      	console.log(this.activeName);
		switch(this.activeName) {
    	 case "1":
        	this.$router.push("/paging");
        	break;
    	 case "2":
       		this.$router.push("/managerlist");
       		 break;
     		/*default:
     		;*/
			}

      }
    }

  };
</script>
