<template>
  <div class="g-footer">
    <slot></slot>
    <el-button type="info"
               @click="addDefaultData">导入范例</el-button>
    <el-button type="success"
               @click="commit">完成</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    addDefaultData () { this.$emit('addDefaultData') },
    commit () { this.$emit('commit') }
  }
}
</script>

<style>
.g-footer {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  background: #fff;
  text-align: right;
  z-index: 100;
  padding: 10px 150px 10px 130px;
}
.g-footer .el-button--info,
.g-footer .el-button--info span {
  color: #5f6c65;
  background: #ccc;
  border-color: #ccc;
}
.g-footer .el-button--success,
.g-footer .el-button--success span {
  background: #0ed04b;
  border-color: #0ed04b;
  color: #fff;
}
</style>