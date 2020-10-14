<template>
  <span class="g-simple"
        contenteditable="false">
    <input type="text"
           ref="gSimple"
           v-model="data"
           :size="dataSize"
           class="g-simple__input"
           :class="{'g-simple__input-blur':isCompleted}"
           :placeholder="placeholder"
           autofocus="true"
           @blur="onBlur"
           @keyup.enter="onBlur">
  </span>
</template>

<script>
export default {
  data () {
    return {
      isInit: false,
      data: '',
      placeholder: '输入正确答案'
    }
  },
  computed: {
    dataSize () {
      if (!this.data) { return this.placeholder.length * 2 }
      let size = 0
      this.data.split('').forEach(item => {
        size = item.charCodeAt() > 255 ? size + 2 : size + 1
      })
      return size + 4
    },
    isCompleted () {
      return this.isInit && this.data.trim().length
    }
  },
  mounted () {
    this.$refs.gSimple.focus()
  },
  methods: {
    onBlur () {
      if (this.data.trim().length) { this.isInit = true }
    }
  }

}
</script>

<style lang="scss">
.g-simple {
  min-width: 200px;
  margin-right: 10px;
  margin-bottom: 10px;
  display: inline-block;
  position: relative;
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  font-size: inherit;
  outline: 0;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  height: 30px;
  line-height: 26px;
  min-width: 100px;
  padding: 0 10px;
  text-align: center;
  &:hover {
    border-color: #c0c4cc;
  }
  &:focus {
    border-color: #409eff !important;
    outline: 0;
  }

  &__input {
    outline: none;
    border: none;
    height: 24px;
    line-height: 24px;
    display: inline-block;
    padding: 0 4px;
    text-align: center;
    &:hover,
    &:active,
    &:focus {
      outline: none;
      border: none;
    }
  }
  &__input-blur {
    background: chartreuse;
  }
}
</style>