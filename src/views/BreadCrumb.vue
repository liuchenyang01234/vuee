<template>
<!-- 面包屑  <router-link to="/user/123">User123</router-link>
   <el-breadcrumb-item><router-link to="/paging">产品列表</router-link></el-breadcrumb-item>

-->
        <div class="breadTop">
         <!--  <i class="el-icon-location-outline"></i> -->
          <el-breadcrumb separator-class="el-icon-arrow-right" style="display: inline-block;font-size: 18px">
            <el-breadcrumb-item>基金产品管理</el-breadcrumb-item>
          <!--   <el-breadcrumb-item to="/paging">产品列表</el-breadcrumb-item> -->
           <!--  :key="item.path" v-if="item.meta.title" :to="item.redirect||item.path"> -->
            <el-breadcrumb-item style="color:black" v-for="item in levelList" v-bind:key="item.path" :to="item.redirect||item.path">
              {{item.meta.title}}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
</template>
<style>
#breadTop .breadcrumb__inner.is-link {color:#606266;}




</style>


<script>


export default {
    data(){
    return {
        levelList: null //面包屑
    }},
    methods: {
        //面包屑
    getBreadcrumb() {
        //console.log(this.$route.matched.filter(item => item.meta.title));  //过滤掉没有meta.title属性的
      let matched = this.$route.matched.filter(item => item.meta.title);
      //$route.matched 将会是一个包含从上到下的所有对象 (副本)。
      this.levelList = matched;
       //console.log("面包屑改变路由 ");
     }
    },
    watch: {
            $route(to, from) {
            console.log("面包屑的路由变化");
           // console.log(to.path);
              this.getBreadcrumb();
            }

          },
    mounted(){

        this.getBreadcrumb()
      }
    }


</script>

