<template>
  <div class="g-question">
    <div class="g-question__btns">
       <el-tooltip :disabled="isTipShow" class="item" effect="dark" content="若使用图片将会替换文字" placement="bottom">
        <el-button class="g-question__upload"
                  type="primary"
                  round
                  plain>
          <Upload @upload="upload"
                  :text="uploadText"></Upload>
        </el-button>
      </el-tooltip>
      <!-- <el-button @click="isRecordShow=true"
                 type="primary"
                 round
                 plain>录音</el-button> -->
    </div>
    <!-- 录音控制 -->
    <div v-if="isRecordShow"
         class="g-question__record">
      <Record @stopRecord="stopRecord"></Record>
    </div>
    <div v-else
         class="g-question__content">
      <i class="el-icon-error g-question__remove"
         v-if="current.content"
         @click="clear"></i>
      <component v-if="isComponentShow"
                 class="g-question__file"
                 :class="{'g-question__audio':current.tag==='audio'}"
                 :is="current.tag"
                 :src="current.content"
                 :ale="current.name"
                 controls="controls"></component>
      <el-input v-else
                type="textarea"
                class="g-question__text"
                placeholder="点击输入描述文字"
                rows="10"
                v-model="value"></el-input>
    </div>
  </div>
</template>

<script>
import Upload from "./Upload";
import Record from "./Record";
export default {
  props: {
    current: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    Upload,Record
  },
  data() {
    return {
      isRecordShow: false,
    }
  },
  computed: {
    value: {
      get() {
        return this.current.content
      },
      set(val) {
        const data={
          content: val,
          size: val.length,
          name: '文字描述',
          tag: 'p'
        }
        this.$emit('update',data)
      }
    },
    isTipShow(){
      return !(!this.isComponentShow && this.value)
    },
    isComponentShow() {
      return ['img','audio','video'].indexOf(this.current.tag)>-1
    },
    uploadText() {
      return this.current.content&&this.isComponentShow? '替换图片':'图片'
      // return this.current.content&&this.isComponentShow? '替换图片或音视频':'图片或音视频'
    }
  },
  watch: {
    current(val) {
      this.isRecordShow=false
    }
  },
  methods: {
    clear() {this.$emit('clear')},
    upload(data) {
      this.$emit('update',data)
    },
    stopRecord(data) {
      this.isRecordShow=false
      // data content size tag name
      this.upload(data,'upload')
    }
  }
}
</script>

<style lang="scss">
.g-question {
  border: 1px solid #ccc;
  border-radius: 14px;
  padding: 4px;
  text-align: center;
  position: relative;
  display: table;
  &__btns {
    width: 100%;
    position: absolute;
    top: 9px;
    z-index: 4;
    left: 50%;
    transform: translateX(-50%);
  }
  &__clear {
    position: absolute;
    top: 10px;
    right: 10px;
  }

  &__file {
    word-wrap: break-word;
    max-height: 20rem;
    max-width: 31rem;
  }

  &__audio {
    margin-top: 100px;
  }

  &__upload {
    padding: 0 !important;
  }

  &__remove {
    position: absolute;
    top: -10px;
    right: -14px;
    cursor: pointer;
    color: #ddd;
    font-size: 24px;
    &:hover {
      color: #1989fa;
    }
  }
  &__text {
    margin-top: 50px;
    .el-textarea__inner::placeholder {
      font-size: 16px;
      color: #5f6c65;
    }
  }
  &__record {
    padding-top: 60px;
    height: 20rem;
  }
  &__content {
    display: table-cell;
    vertical-align: middle;
    height: 20rem;
  }
  .el-button {
    vertical-align: middle;
  }

  .el-textarea__inner {
    border: none;
  }
}
</style>