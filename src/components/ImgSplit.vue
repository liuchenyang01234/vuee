
<template>
  <div class="cropper-component">
    <div class="info-item">
      <div class="btn-box">
        <label class="btn" for="uploads" v-if="!ifImg">
          <i class="el-icon-plus" style="font-size:50px" />
          <br />上传图片
        </label>
        <!-- <el-button
          type="file"
          @change="uploadImg($event, 1)"
          style="width:160px;height:160px;background:#FAFAFA;padding-top:15px;text-align:center"
        >
          <i class="el-icon-circle-plus-outline" style="font-size:50px" />
          <br />上传照片
        </el-button>-->
        <input
          type="file"
          id="uploads"
          :value="imgFile"
          style="position:absolute; clip:rect(0 0 0 0);width: 1px;"
          accept="image/png, image/jpeg, image/gif, image/jpg"
          @change="uploadImg($event, 1)"
        />

        <!-- <input type="button" class="operation-btn" value="↺" title="左旋转" @click="rotateLeft" />
        <input type="button" class="operation-btn" value="↻" title="右旋转" @click="rotateRight" />
        <input type="button" class="operation-btn" value="↓" title="下载" @click="down('blob')" />-->
        <!-- <div class="btn" @click="finish('blob')">上传头像</div> -->
        <!-- 上传图片的显示部分-->
      </div>
      <el-dialog title="选择图片" :visible.sync="dialogVisible" width="400px" style="text-align: center">
        <div class="operation-box">
          <div class="cropper">
            <vueCropper
              ref="cropper"
              :img="option.img"
              :outputSize="option.size"
              :outputType="option.outputType"
              :info="option.info"
              :full="option.full"
              :canMove="option.canMove"
              :canMoveBox="option.canMoveBox"
              :original="option.original"
              :autoCrop="option.autoCrop"
              :autoCropWidth="option.autoCropWidth"
              :autoCropHeight="option.autoCropHeight"
              :fixedBox="option.fixedBox"
              @realTime="realTime"
              @imgLoad="imgLoad"
            ></vueCropper>
          </div>
        </div>
        <!-- <div>
          <el-button @click="changeScale(1)">放大</el-button>
          <el-button @click="changeScale(-1)">缩小</el-button>
        </div>-->
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit()">确 定</el-button>
        </span>
      </el-dialog>

      <div class="preview-box" v-if="ifImg">
        <div :style="previews.div" class="preview">
          <img :src="previews.url" :style="previews.img" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import AxiosService from "@/utils/request.js";
  import { VueCropper } from "vue-cropper";
  import { debug, debuglog } from "util";
  export default {
    name: "ImgSplit",
    components: {
      VueCropper
    },

    data() {
      return {
        dialogVisible: false,
        file: "",
        //剪切图片上传
        ifImg: false,
        crap: false,
        previews: {},
        option: {
          img: "", // 裁剪图片的地址
          info: true, // 裁剪框的大小信息
          outputSize: 1, // 剪切后的图片质量（0.1-1）
          full: true, // 输出原图比例截图 props名full

          outputType: "jpeg",      //裁剪生成额图片的格式  可以改变上传后图像的大小
        //  outputType: "png", // 裁剪生成额图片的格式
          canMove: true, // 能否拖动图片
          original: false, // 上传图片是否显示原始宽高
          canMoveBox: true, // 能否拖动截图框
          autoCrop: true, // 是否默认生成截图框
          autoCropWidth: 300,  //默认裁剪框的大小
          autoCropHeight: 300, //默认裁剪框的大小
          fixedBox: false // 截图框固定大小
        },
        fileName: "", // 本机文件地址
        downImg: "#",
        imgFile: "",
        uploadImgRelaPath: "" // 上传后的图片的地址（不带服务器域名）
      };
    },
    props: ["uploadType"],
    methods: {
      submit() {
        this.finish(this.file);
      },
      // 放大/缩小
      changeScale(num) {
        num = num || 1;
        this.$refs.cropper.changeScale(num);
      },
      // 坐旋转
      rotateLeft() {
        this.$refs.cropper.rotateLeft();
      },
      // 右旋转
      rotateRight() {
        this.$refs.cropper.rotateRight();
      },
      // 上传图片（点击上传按钮）
      // 上传按钮   限制图片大小
      changeUpload(file, fileList) {
        const isLt500K = file.size / 1024 < 5
        if (!isLt500K) {
          this.$message.error('上传文件大小不能超过 500k!')
          return false
        }
        this.fileinfo = file
        // 上传成功后将图片地址赋值给裁剪框显示图片
        this.$nextTick(() => {
          this.option.img = file.url
          this.dialogVisible = true
        })
      },
      // 点击裁剪，这一步是可以拿到处理后的地址
      finish(type) {
        let _this = this;
        let formData = new FormData();
        // 输出
        this.$refs.cropper.getCropBlob((data) => {
          let img = window.URL.createObjectURL(data)
          this.model = true;
          this.modelSrc = img;
          formData.append("file", data, this.fileName);
          AxiosService.post('/file/upload', formData, {contentType: false, processData: false, headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
            .then((response)=>{
              if(response.data.code == 200){  //根据返回code 处理逻辑
                // _this.imgFile = '';
                // _this.headImg = res.realPathList[0];  //完整路径
                // _this.uploadImgRelaPath = res.relaPathList[0];  //非完整路径
                console.log("返回值"+response.data.data);
                this.$store.commit("setManagerPic",response.data.data);
                _this.$message({　　//element-ui的消息Message消息提示组件
                  type: 'success',
                  message: '上传成功'
                });

              }
            })
          this.dialogVisible = false;
          this.ifImg = true;
        })
      },
      //上传成功响应
      //上传失败
      //取消上传
      // 实时预览函数
      realTime(data) {
        console.log("ImgSplit实时显示");
        this.previews = data;
      },
      // 下载图片
      down(type) {
        console.log("down");
        var aLink = document.createElement("a");
        aLink.download = "author-img";
        if (type === "blob") {
          this.$refs.cropper.getCropBlob(data => {
            this.downImg = window.URL.createObjectURL(data);
            aLink.href = window.URL.createObjectURL(data);
            aLink.click();
          });
        } else {
          this.$refs.cropper.getCropData(data => {
            this.downImg = data;
            aLink.href = data;
            aLink.click();
          });
        }
      },
      // 选择本地图片
      uploadImg(e, num) {
        console.log("选择图片，即点击了  @change=\"uploadImg($event, 1)");
        var _this = this;
        // 获得上传图片
        var file = e.target.files[0];
        this.file = file;
        _this.fileName = file.name;

        if (!/\.(jpg|png|JPG|PNG)$/.test(e.target.value)) {
          alert("图片类型必须是jpg,png中的一种");
          return false;
        }
        //判断输出图片类型
        if(/\.(jpg|JPG)$/.test(e.target.value)) {
          this.option.outputType  = 'jpeg';
        }else if(/\.(png|PNG)$/.test(e.target.value)) {
          this.option.outputType  = 'png';
        }
        console.log("文件的大小  "+file.size / 1024 + "kb");
        if (file.size > 512000) {
          alert("文件大小超出500k，请重新上传");
           return false;
        }
        //读file
        var reader = new FileReader();
        reader.onload = e => {
          let data;
          if (typeof e.target.result === "object") {
            // 把Array Buffer转化为blob 如果是base64不需要
            data = window.URL.createObjectURL(new Blob([e.target.result]));
          } else {
            data = e.target.result;
          }
          if (num === 1) {
            _this.option.img = data;
          } else if (num === 2) {
            _this.example2.img = data;
          }
        };
        // 转化为base64
        // reader.readAsDataURL(file)
        // 转化为blob
        reader.readAsArrayBuffer(file);
        this.dialogVisible = true;
        console.log("this.option.img--------------------");
        console.log(this.option.img);
        console.log("this.option.img--------------------");
        // this.finish(file);
      },
      imgLoad(msg) {
        console.log("ImgSplit图片加载");
        console.log(msg);
      }
    }
  };
</script>

<style lang="scss">
  .cropper-component {
    // width: 500px;
    position: relative;
    .btn-box {
      margin: 20px 0;
      .btn {
        padding: 38px 42px;
        text-align: center;
        border-radius: 4px;
        background-color: #fafafa;
        color: #000;
        border: 1px dashed #e8e8e8;
        cursor: pointer;
        display: inline-block;
      }
      .operation-btn {
        width: 30px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background-color: #fff;
        border: 1px solid #eaeaea;
        cursor: pointer;
        display: inline-block;
        font-size: 20px;
        color: #333;
        padding: 0;
        margin: 0 10px;
      }
    }
    .info-item {
      .operation-box {
        display: inline-block;
        .cropper {
          width: 260px;
          height: 260px;
        }
      }
      .preview-box {
        top: 60px;
        right: 10px;
        .preview {
          width: 150px;
          height: 150px;
          // border-radius: 50%;
          border: 1px solid #ccc;
          background-color: #ccc;
          margin: 5px;
          overflow: hidden;
        }
      }
    }
  }
</style>
