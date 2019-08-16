<template>
	<div id="app">


 <router-view></router-view>



	</div>


</template>

<style>

  /* 设置所有的字体
*/
  .el-tabs__item{font-size: 18px }
  .el-form-item__label{font-size: 18px}

  .el-form-item__content{font-size: 18px}

  .el-input__inner{font-size: 18px}
  .el-button{font-size: 18px}
  .el-textarea__inner{font-size: 18px}
  /* page */
  .el-pager li{font-size: 16px}
  .el-pagination button, .el-pagination span:not([class*=suffix]) {font-size: 16px}
  .el-message{font-size: 18px}
</style>



<script>
import login from '@/views/Login/login'

export default {
  name: 'newApp',
  components:{
    'login':login
  },
  watch:{
      '$route':function(to,from){
          console.log("to.path");
          console.log(to.path);
          if(to.path=="/first")
          	this.$router.push("/paging");

      }
    }

}

</script>
