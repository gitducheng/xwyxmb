<template>
  <div class="g-header">
    <el-input placeholder="选词填空"
              maxlength="8"
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
</style>