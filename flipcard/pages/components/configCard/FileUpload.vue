<template>
    <div class="file-upload">
      <file-upload
        ref="upload"
        v-model="files"
        :name="name"
        :post-action="postAction"
        :accept="accept"
        :size="fileSize"
        @input-file="inputFile"
      >
      <slot/>
      </file-upload>
    </div>
</template>
<script>
import fileUpload from 'vue-upload-component'

export default {
  name: 'FileUpload',
  components: {
    fileUpload
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    postAction: {
      type: String,
      default: ''
    },
    accept: {
      type: String,
      default: ''
    },
    size: {
      type: Number,
      default: 3
    }
  },
  data () {
    return {
      files: []
    }
  },
  computed: {
    fileSize() {
      return  this.size * 10000 * 1024
    }
  },
  watch: {
    files: function () {
      const that = this
      var file = this.files[0].file;
        //这里我们判断下类型如果不是图片就返回 去掉就可以上传任意文件
      if (['image/jpg','image/png','image/jpeg'].indexOf(file.type) < 0) {
        this.$message({type: 'warning',message:"只支持.png和.jpg格式的图片哦"})
        return false
      }
      if(file.size>1024*1024){
        this.$message({type: 'warning',message:"请上传1M以内的图片"})
        return false
      }
      var reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function(e){
        that.$emit('fileBaseData', this.result)
      }
    }
  },
  methods: {
    inputFile() {
      // console.log('test')
    }
  }
}
</script>

<style lang="less">
.file-upload {

  font-family: 'Microsoft YaHei';
  .file-uploads {
    overflow: visible !important;
    cursor: pointer;
  }
  .file-uploads.file-uploads-html5 label {
    cursor: pointer;
  }
}

</style>
