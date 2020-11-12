<template>
  <div
    class="card__col"
    :class="{'card__col--selected': selected}"
    @click="cardClick"
  >
    <div v-if="length > 2 && selected" class="card__col__close" @click="deleteCard">×</div>
    <!-- 正面 -->
    <div class="card__col__small card__col__small--zheng"
         :class="{'card__col__small--selected': selected && zhengSelected}"
         @click.stop="zhengCardClick"
    >
      <div v-if="selected && zhengSelected" class="card__col__close" @click="clearData('zheng')">×</div>
      <span class="position-content">正</span>
      <el-input
        v-if="!cardData.zhengImg"
        class="input"
        maxlength="8"
        v-model="cardData.zhengText"
        placeholder="请输入内容"
        @focus="showZhengFileUpload = 'focus'"
        @blur="showZhengFileUpload = 'blur'"
      ></el-input>
      <FileUpload
        v-if="showZhengFileUpload && !cardData.zhengText"
        class="use-img-btn"
        :name="zhengUuid"
        :accept="accept"
        @fileBaseData="getFileBaseData($event, 'zhengImg')"
      >{{cardData.zhengImg ? '替换图片' : '使用图片'}}</FileUpload>
      <div class="file-img" v-if="cardData.zhengImg">
        <img :src="cardData.zhengImg" alt="">
      </div>
    </div>
    <!-- 反面 -->
    <div class="card__col__small card__col__small--fan"
         :class="{'card__col__small--selected': selected && fanSelected}"
         @click.stop="fanCardClick"
    >
      <div v-if="selected && fanSelected" class="card__col__close" @click="clearData('fan')">×</div>
      <span class="position-content">反</span>
      <el-input
        v-if="!cardData.fanImg"
        class="input"
        maxlength="8"
        v-model="cardData.fanText"
        placeholder="请输入内容"
        @focus="showFanFileUpload = 'focus'"
        @blur="showFanFileUpload = 'blur'"
      ></el-input>
      <FileUpload
        v-if="showFanFileUpload && !cardData.fanText"
        class="use-img-btn"
        :name="fanUuid"
        :accept="accept"
        @fileBaseData="getFileBaseData($event, 'fanImg')"
      >{{cardData.fanImg ? '替换图片' : '使用图片'}}</FileUpload>
      <div class="file-img" v-if="cardData.fanImg">
        <img :src="cardData.fanImg" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import FileUpload from './FileUpload'
import uuid from 'uuid'

export default{
  name: "ConfigCard",
  components: {
    FileUpload
  },
  props: {
    length: {
      type: Number,
    },
    selected: {
      type: Boolean,
      default: true
    },
    index: {
      type: Number,
      default: -1
    },
    value: { default: undefined },
  },
  data() {
    return {
      titleVal: '',
      accept: 'image/*',
      showZhengUseImgBtn: true,
      showFanUseImgBtn: true,
      zhengSelected: false,
      fanSelected: false
    }
  },
  computed: {
    zhengUuid() {
      return uuid()
    },
    fanUuid() {
      return uuid()
    },
    cardData() {
      return this.value
    },
    showZhengFileUpload: {
      get() {
        return this.showZhengUseImgBtn
      },
      set(val) {
        if (val === 'focus') {
          this.showZhengUseImgBtn = false
          return
        }
        if (this.cardData.zhengText) {
          this.showZhengUseImgBtn = false
        } else {
          this.showZhengUseImgBtn = true
        }
      }
    },
    showFanFileUpload: {
      get() {
        return this.showFanUseImgBtn
      },
      set(val) {
        if (val === 'focus') {
          this.showFanUseImgBtn = false
          return
        }
        if (this.cardData.fanText) {
          this.showFanUseImgBtn = false
        } else {
          this.showFanUseImgBtn = true
        }
      }
    },
  },
  watch: {
    cardData: {
      handler: function (val, oldVal) {
        this.showZhengFileUpload = 'blur'
        this.showFanFileUpload = 'blur'
        this.$emit('input', val)
      },
      deep: true
    },
  },
  methods: {
    getFileBaseData(data, type) {
      if (!data) return
      this.cardData[type] = data
    },

    cardClick() {
      this.zhengSelected = false
      this.fanSelected = false
      this.$emit('currentIndex', this.index)
    },

    zhengCardClick() {
      this.zhengSelected = true
      this.fanSelected = false
      this.$emit('currentIndex', this.index)
    },

    fanCardClick() {
      this.zhengSelected = false
      this.fanSelected = true
      this.$emit('currentIndex', this.index)
    },

    deleteCard() {
      this.$emit('deleteCard', this.index)
    },
    // 清空数据
    clearData(type) {
      if (type === 'zheng') {
        this.cardData.zhengText = ''
        this.cardData.zhengImg = ''
        this.showZhengFileUpload = 'blur'
      } else if (type === 'fan') {
        this.cardData.fanText = ''
        this.cardData.fanImg = ''
        this.showFanFileUpload = 'blur'
      }
    }

  }
}
</script>

<style lang="less">
.card__col {
  font-family: 'Microsoft YaHei';
  display: inline-block;
  width: 394px;
  padding: 10px;
  margin: 0 10px 10px;
  // margin-bottom: 10px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  // background: pink;
  position: relative;
  &:hover,
  &--selected {
    border-color: aqua;
  }
  &__close {
    position: absolute;
    top: -6px;
    right: -6px;
    display: block;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 1px solid #c00;
    font-size: 12px;
    line-height: 10px;
    cursor: pointer;
  }
  &__small {
    display: block;
    width: 174px;
    height: 120px;
    margin: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    // background: #fff;
    position: relative;
    float: left;
    &--selected {
      border-color: aqua;
    }
    &:before {
      content: '';
      display: inline-block;
      position: absolute;
      top: 0;
      left: 0;
      width: 26px;
      height: 20px;
      border-radius: 4px 0 24px 0;
      background: #ccc;
    }
    &--zheng {
      &:before {
        background: yellow;
      }
    }
    .position-content {
      position: absolute;
      top: 0;
      left: 0;
      display: inline-block;
      width: 22px;
      height: 20px;
      font-size: 12px;
    }
    .input {
      margin-top: 40px;
      text-align: center;
    }
    .el-input__inner {
      border: none;
      text-align: center;
      font-size: 16px;
      color: #152c2c;
    }
    .use-img-btn {
      position: absolute;
      top: 6px;
      right: 6px;
      display: inline-block;
      padding: 3px 10px;
      font-size: 12px;
      background: #ccc;
      color: #fff;
      border-radius: 12px;
      cursor: pointer;
      z-index: 2;
    }
    .file-img {
      width: 174px;
      height: 118px;
      display: table-cell;
      vertical-align: middle;
      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
  }
}
// placeholder
input::-webkit-input-placeholder {
  color: #5f6c65;
}

input:-moz-placeholder {
  color: #5f6c65;
}

input::-moz-placeholder {
  color: #5f6c65;
}

input:-ms-input-placeholder {
  color: #5f6c65;
}
</style>
