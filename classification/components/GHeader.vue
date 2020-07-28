<template>
  <div class="g-header">
    <el-input placeholder="点击输入标题"
              maxlength="6"
              v-model="title"></el-input>
  </div>
</template>

<script>
export default {
  name: 'GHeader',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  computed: {
    title: {
      get () { return this.value },
      set (val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>

<style>
.g-header {
  font-size: 16px;
  color: #152c2c;
  text-align: center;
  width: 300px;
  margin: 20px auto 0;
}
.el-input__inner::placeholder {
  color: #5f6c65;
  font-size: 16px;
}

input,
.el-input,
.el-input__inner,
textarea,
.el-textarea__inner {
  font-size: 16px;
  color: #152c2c;
}
</style>