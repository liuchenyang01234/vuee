<template>
  <div>
    <span :seckillTime="seckillTime">{{seckillText}}</span>
  </div>
</template>
<script>
  export default {
    props: {
      //开始时间
      seckillTime: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        seckillText: ""
      };
    },
    created() {
      setInterval(() => {
        this.getDistanceTime(this.seckillTime, "showInterval"), 0;
      });
    },
    methods: {
      getDistanceTime(time, showInterval) {
        /*replace将时间字符串中所有的'-'替换成'/',parse将时间格式的字符串转换成毫秒*/
        var endTime = new Date(Date.parse(time.replace(/-/g, "/")));
        var nowTime = new Date();
        var distance = endTime.getTime() - nowTime.getTime();
        /*getTime把一个date对象转换成毫秒*/
             //   console.log(new Date().getTime() -  endTime.getTime() > 1000 * 60 * 15)
        var day = 0;
        var hour = 0;
        var minute = 0;
        var second = 0;

        if (distance >= 0) {
          day = Math.floor(distance / 1000 / 60 / 60 / 24);
          hour = Math.floor((distance / 1000 / 60 / 60) % 24);
          minute = Math.floor((distance / 1000 / 60) % 60);
          second = Math.floor((distance / 1000) % 60);
          this.seckillText = "距离秒杀还是还有" + day + "天" + hour + "时" +
            minute + "分" + second + "秒";
        } else {
          this.seckillText = "";
        }
      }
    }
  };
</script>
