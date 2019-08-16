
<template>
  <div class="cropper-component1">
    <template v-if="!ifImg">
      <div style="width:100px;">
        <img :src="imgUrl" height="200px" width="150px" />
      </div>
    </template>
    <div class="info-item">
      <div class="preview-box" v-if="ifImg">
        <div :style="previews.div" class="preview">
          <img :src="previews.url" :style="previews.img" />
        </div>
      </div>
      <div class="btn-box">
        <label class="btn" for="uploads" style="margin: 0 0 0 50px">更改</label>
        <input
          type="file"
          id="uploads"
          :value="imgFile"
          style="position:absolute; clip:rect(0 0 0 0);width: 1px;"
          accept="image/png, image/jpeg, image/gif, image/jpg"
          @change="uploadImg($event, 1)"
        />
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
    props: { imgUrl: { type: String } },

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
          outputType: "png", // 裁剪生成额图片的格式
          canMove: true, // 能否拖动图片
          original: false, // 上传图片是否显示原始宽高
          canMoveBox: true, // 能否拖动截图框
          autoCrop: true, // 是否默认生成截图框
          autoCropWidth: 300,
          autoCropHeight: 300,
          fixedBox: false // 截图框固定大小
        },
        fileName: "", // 本机文件地址
        downImg: "#",
        imgFile: "",
        uploadImgRelaPath: "" // 上传后的图片的地址（不带服务器域名）
      };
    },
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
      finish(file) {
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
                console.log("返回值"+response.data.data);
                this.$store.commit("setManagerPic",response.data.data);
                this.$store.commit("setManageredit",2);
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

      // 实时预览函数
      realTime(data) {
        console.log("realTime");
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
        console.log("uploadImg");
        var _this = this;
        // 上传图片
        var file = e.target.files[0];   //获取文件   this.file = event.target.files[0];
        this.file = file;
        _this.fileName = file.name;

        if (!/\.(jpg|png|JPG|PNG)$/.test(e.target.value)) {
          alert("图片类型必须是jpg,png中的一种");
          return false;
        }
        console.log(file.size / 1024 + "kb");
        if (file.size > 512000) {
          alert("文件大小超出500k，请重新上传");
        }
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
        console.log("imgLoad");
        console.log(msg);
      }
    }
  };
</script>

<style lang="scss">
  .cropper-component1 {
    // width: 500px;
    position: relative;
    .btn-box {
      margin: 0px 0;
      .btn {
        margin-left: 25px;
        line-height: 21px;
        padding: 0px 8px;
        text-align: center;
        border-radius: 4px;
        background-color: #fafafa;
        color: #000;
        border: 1px solid #e8e8e8;
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
