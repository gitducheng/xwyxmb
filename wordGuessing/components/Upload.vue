<template>
  <fileuUpload class="g-upload"
               v-model="files">{{text}}</fileuUpload>
</template>

<script>
import fileuUpload from 'vue-upload-component'
export default {
  props: {
    text: {
      type: String,
      default: '图片或音视频'
    }
  },
  components: {
    fileuUpload
  },
  data() {
    return {
      files: []
    }
  },
  watch: {
    files(val) {
      if(!val.length||!val[0].file) {return false}
      const {type,size,name}=val[0]
      const TAG_DIC={
        image: 'img',
        // video: 'video',
        // audio: 'audio',
      }
      const fileType=(/^(.*)\//.exec(type)||[])[1]
      const tag=TAG_DIC[fileType]

      if(!tag) {
        this.$message({
          // message: `只支持图片/视频/音频哦`,
          message: `只支持图片哦`,
          type: 'warning'
        })
        return false
      }

      const reader=new FileReader()
      reader.readAsDataURL(val[0].file)
      reader.onload=(e) => {
        this.$emit('upload',{
          content: e.target.result,
          tag,size,name
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.g-upload {
  display: inline-block;
  padding: 12px 20px;
}
</style>