<template>
  <fileuUpload class="g-upload"
               v-model="files"
               :name="`upload${current}`"></fileuUpload>
</template>

<script>
  import fileuUpload from 'vue-upload-component'
  export default {
    components: {
      fileuUpload
    },
    props: {
      current: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        files: []
      }
    },
    watch: {
      files (val) {
        if (!val.length || !val[0].file) { return false }
        const { type, size, name } = val[0]
        const TAG_DIC = {
          image: 'img',
        }
        const fileType = (/^(.*)\//.exec(type) || [])[1]
        const tag = TAG_DIC[fileType]

        if (!tag) {
          this.$message({
            message: `只支持图片哦`,
            type: 'warning'
          })
          return false
        }

        const reader = new FileReader()
        reader.readAsDataURL(val[0].file)

        reader.onload = (e) => {
          this.$emit('upload', {
            content: e.target.result,
            current: this.current,
          })
        }
      }
    }
  }
</script>