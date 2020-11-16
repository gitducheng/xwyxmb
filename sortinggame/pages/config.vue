<template>
  <div class="g-config">
    <h2 class="g-config__title">排序游戏</h2>
    <GHeader v-model="title"></GHeader>
    <div class="g-config__main">
      <el-table :data="tableData" height="100%" style="width: 100%">
        <el-table-column prop="value" label width="60">
          <template slot-scope="scope">
            <i class="el-icon-circle-close g-config__remove" @click="removeData(scope.$index)"></i>
            <span>{{scope.$index+1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="value" :label="nameLabel">
          <template slot-scope="scope">
            <el-input
              class="g-config__sub-class-input"
              v-model="scope.row.value"
              maxlength="20"
              @keyup.enter.native="addData(scope.$index)"
              placeholder="点击输入文字内容"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="g-config__other-item g-config__tips">
      <VueUploadComponent v-model="tipFile" name="tipFile" class="g-config__upload">添加图片</VueUploadComponent>
      <el-input v-model="tips" maxlength="50" type="textarea" placeholder="点击输入提示"></el-input>
      <div class="g-config__tips-img">
        <span class="g-config__tips-img-item" v-for="(item,index) in tipsImage" :key="index">
          <img :src="item" width="50" height="50" />
          <span
            @click="removeTipsImage(index)"
            class="el-icon-circle-close g-config__tips-img-close"
          ></span>
        </span>
      </div>
    </div>
    <div class="g-config__other-item g-config__parse">
      <VueUploadComponent v-model="parseFile" name="parseFile" class="g-config__upload">添加图片</VueUploadComponent>
      <el-input v-model="parseText" maxlength="50" type="textarea" placeholder="点击输入解析"></el-input>
      <div class="g-config__tips-img">
        <span class="g-config__tips-img-item" v-for="(item,index) in parseImage" :key="index">
          <img :src="item" width="50" height="50" />
          <span
            @click="removeParseImage(index)"
            class="el-icon-circle-close g-config__tips-img-close"
          ></span>
        </span>
      </div>
    </div>
    <GFooter @commit="commit" @addDefaultData="addDefaultData">
      <el-button
        @click="addData"
        class="g-config__addClass"
        type="warning"
        round
        icon="el-icon-circle-plus-outline"
      >添加排序项</el-button>
    </GFooter>
  </div>
</template>

<script>
import defaultData from "@/static/defaultData";
import InitGame from "~/assets/game";
import VueUploadComponent from "vue-upload-component";

function resize() {
  var w = document.body.clientWidth;
  document.querySelector("html").style.fontSize = (w * 20) / 1920 + "px";
}
export default {
  components: {
    VueUploadComponent
  },
  data() {
    return {
      title: "古诗排序", //题干
      tips: "",
      tipsImage: [],
      parseText: "",
      parseImage: [],
      tableData: [{ value: "" }, { value: "" }],
      tipFile: [],
      parseFile: []
    };
  },
  computed: {
    nameLabel() {
      return `排序项 ${this.tableData.length}/15`;
    }
  },
  watch: {
    tipFile(val) {
      if (!val.length || !val[0].file) {
        return false;
      }

      if (['image/jpg','image/png','image/jpeg'].indexOf(val[0].type) < 0) {
        this.$message({
          message: `只支持.png和.jpg格式的图片哦`,
          type: "warning"
        });
        return false;
      }
      if (val[0].size>1024*1024) {
        this.$message({
          message: `只支持上传1M以内的图片哦`,
          type: "warning"
        });
        return false;
      }

      const reader = new FileReader();
      reader.readAsDataURL(val[0].file);
      reader.onload = e => {
        // e.target.result
        if (this.tipsImage.length >= 5) {
          this.$message({
            message: `最多只能上传5张图片`,
            type: "warning"
          });
          return false;
        }
        this.tipsImage.push(e.target.result);
      };
    },
    parseFile(val) {
      if (!val.length || !val[0].file) {
        return false;
      }

      if (['image/jpg','image/png','image/jpeg'].indexOf(val[0].type) < 0) {
        this.$message({
          message: `只支持.png和.jpg格式的图片哦`,
          type: "warning"
        });
        return false;
      }
      if (val[0].size>1024*1024) {
        this.$message({
          message: `只支持上传1M以内的图片哦`,
          type: "warning"
        });
        return false;
      }

      const reader = new FileReader();
      reader.readAsDataURL(val[0].file);
      reader.onload = e => {
        // e.target.result
        if (this.parseImage.length >= 5) {
          this.$message({
            message: `最多只能上传5张图片`,
            type: "warning"
          });
          return false;
        }
        this.parseImage.push(e.target.result);
      };
    }
  },
  async mounted() {
    document.body.onresize = resize;
    resize();

    const data = await this.getConfigData();
    if (data && data.name === 'sortingData') {
      this.title = data.title
      this.tips = data.tips
      this.parseText = data.parseText;
      this.tipsImage = data.tipsImage;
      this.parseImage = data.parseImage;
      this.tableData = data.data.map(item => ({ value: item }));
    }
  },
  methods: {
    removeData(index) {
      if (this.tableData.length <= 2) {
        this.$message({
          message: "至少需要两道题目哦",
          type: "error"
        });
        return false;
      }
      this.tableData.splice(index, 1);
    },
    async commit() {
      // 校验
      const valify = this.tableData.every((item, index) => item.value);
      if (!this.title) {
        this.$message({
          type: "error",
          message: "标题还未填写哦"
        });
        return false;
      }
      if (!valify) {
        this.$message({
          type: "error",
          message: "还有题目未填写哦"
        });
        return false;
      }

      const datas = {
        name: 'sortingData',
        title: this.title,
        data: this.tableData.map(item => item.value),
        tips: this.tips,
        parseText: this.parseText,
        tipsImage: this.tipsImage,
        parseImage: this.parseImage
      };
      // 接口
      try {
        const thumbnail = await this.getGameImg(datas);
        const saveResponse = await this.$testsave(thumbnail, JSON.stringify(datas));
        if (saveResponse === "success") {
          this.$router.replace("/");
        }
      } catch (error) {
        console.log(error);
        localStorage.setItem("sortingData", JSON.stringify(datas));
        this.$router.replace("/");
      }
    },
    addDefaultData() {
      this.title = defaultData.title;
      this.tips = defaultData.tips;
      this.parseText = defaultData.parseText;
      this.tableData = defaultData.data.map(item => ({ value: item }));
    },
    addData(index = this.tableData.length - 1, scope) {
      if (this.tableData.length >= 15) {
        this.$message({
          message: "最多添加15个题目",
          type: "error"
        });
        return false;
      }

      if (!this.tableData[index + 1]) {
        this.tableData.push({ value: "" });
      }
      this.$nextTick(() => {
        const el = document.querySelectorAll(
          ".g-config__sub-class-input input"
        )[index + 1];
        if (el) {
          el.focus();
        }
      });
    },
    async getGameImg(datas) {
      const container = document.createElement("div");
      return new Promise((resolve, reject) => {
        new InitGame({
          container,
          configData: datas,
          callback: game => {
            const { stage, ticker } = game;
            if (stage.canvas && ticker) {
              const img = stage.canvas.toDataURL("image/png");
              if (img) {
                return resolve(img);
              }
            }
          }
        });

        setTimeout(() => {
          reject();
        }, 4000);
      });
    },
    removeTipsImage(index) {
      this.tipsImage.splice(index, 1);
    },
    removeParseImage(index) {
      this.parseImage.splice(index, 1);
    },
    async getConfigData() {
      try {
        const result = await this.$testload();
        if (typeof result === "string") {
          return JSON.parse(result || null);
        }
      } catch (error) {
        return JSON.parse(localStorage.getItem("sortingData") || null);
      }
    }
  }
};
</script>

<style lang="scss">
* {
  font-family: "微软雅黑";
  color: #152c2c;
}
.el-textarea__inner::placeholder {
  color: #5f6c65;
  font-size: 16px;
}
.el-input__inner::placeholder {
  color: #5f6c65;
  font-size: 16px;
}
input::placeholder {
  color: #5f6c65;
  font-size: 16px;
}
textarea::placeholder {
  color: #5f6c65;
  font-size: 16px;
}
input,
.el-input,
.el-input__inner,
textarea,
.el-textarea__inner {
  font-size: 16px;
  color: #5f6c65;
}
html,
body,
#__nuxt,
#__layout,
#__layout > div,
.g-config {
  height: 100%;
}
html {
  overflow: hidden;
}
.g-config {
  width: 90%;
  height: 100%;
  margin: 20px auto 0;
  overflow: auto;
  padding: 0 15px 90px;

  &__title {
    font-size: 16px;
    color: #152c2c;
    width: 100%;
    text-align: center;
  }

  &__main {
    margin-top: 20px;
    padding-bottom: 10px;
    width: 100%;
    height: 55%;

    .el-table td,
    .el-table th {
      padding: 0;
    }
    .el-input__inner {
      border: none;
      background-color: transparent;
    }

    .el-table--enable-row-hover .el-table__body tr:hover > td {
      .g-config__remove {
        display: inline-block;
      }
    }

    .el-table .el-input {
      // width: 200px;
    }

    .el-table tbody .cell {
      text-align: right !important;
      padding-right: 10px;
    }
  }

  &__class-name {
    .el-input__inner {
      padding-left: 26px;
    }
  }

  &__remove {
    position: absolute;
    font-size: 16px;
    top: 50%;
    left: 1px;
    display: none;
    cursor: pointer;
    transform: translateY(-50%);
    z-index: 3;
    &:hover {
      color: #5cb6ff;
    }
  }
  &__addClass {
    float: left;
    margin-left: 40px;
    color: #fff;
    span,
    i {
      color: #fff;
    }
    i {
      font-size: 20px;
      vertical-align: middle;
      line-height: 10px;
    }
  }

  &__sub-class-input {
    display: inline-block;
    .el-input__inner {
      padding: 0;
    }
  }

  &__sub-class {
    margin-left: 4px;
    background: #dffff4;
    width: 50px !important;
    .el-input__inner {
      padding: 0;
      text-align: center;
    }
  }

  &__other-item {
    position: relative;
    margin-top: 10px;
    width: 45%;
    min-height: 10rem;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    padding: 0 15px;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    &:hover {
      border-color: #409eff;
    }

    .el-textarea__inner {
      border: none;
      resize: none;
      padding-left: 0;
      padding-right: 0;
      padding-top: 12px;
      &:hover {
        border: none;
      }
    }
  }
  &__tips {
    float: left;
    margin-bottom: 10px;
    width: 47%;
  }
  &__parse {
    float: right;
    width: 45%;
    margin-bottom: 10px;
  }
  &__upload {
    cursor: pointer;
    border: 1px solid #ccc;
    border-radius: 30px;
    padding: 4px 10px;
    position: absolute !important;
    right: -16px;
    top: -14px;
    z-index: 4;
    background: #fff;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    &:hover {
      border-color: #409eff;
      background: #ecf5ff;
    }
    & label {
      cursor: pointer;
    }
  }

  &__tips-img-item {
    position: relative;
    display: inline-block;
    margin-right: 5px;
  }
  &__tips-img {
    margin-top: 16px;
  }
  &__tips-img-close {
    position: absolute;
    top: 0;
    right: 0;
    position: absolute;
    top: -14px;
    right: -6px;
    font-size: 16px;
    z-index: 4;
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
  }
}
</style>