<template>
  <div>
<el-dropdown @command="handleCommand">
  <span class="el-dropdown-link" style="color:white;font-size: 18px">
    用户{{name}}({{(Array(4).join(0) + id).slice(-4)}})
  </span>
  <el-dropdown-menu slot="dropdown">
  <!--  <el-dropdown-item command="a">个人信息</el-dropdown-item>-->
    <el-dropdown-item command="b">退出</el-dropdown-item>
  </el-dropdown-menu>
</el-dropdown>

  </div>

</template>



<style>
  .el-dropdown-link {
    cursor: pointer;
    /* color: #409EFF; */
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>

<script type="text/javascript">
  export default{
data(){

  return{
    id:new Number,
    name:''

  }

},
   mounted:function(){
             this.setCookies();    //需要触发的函数
    } ,
    methods:{
          setCookies:function () {
            //  console.log("执行了setCookies");
              console.log("name        "+this.name);
                     this.id=this.$store.getters.id;
                     this.name=this.$store.getters.name;
                console.log("name        "+this.name);


          },
          handleCommand:function (message) {
            console.log(message);
                  switch(message) {
         case "a":
            break;
         case "b":
               this.Signout();
                break;
             default:
             ;
            }

          },
           Signout:function () {
                    //vuex的东西也要清除
                    localStorage.removeItem("vuex");
                   this.$router.push({name: 'login'})
           }




            }
        }



</script>
