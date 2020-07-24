
<style lang="less" scoped>
.number {
  display: flex;
  justify-content: center;
  align-items: center;

  //   margin-right: 1 / @scaleW;
  .number-item {
    flex-shrink: 0;

    // height: 21 / @scaleW;
    // width: 21 / @scaleW;
  }
}
</style>
<template>
  <div class="number">
    <div class="number-item" v-for="(item, index) in strings" :key="index">
      <div v-if="source[`${item}.png`]">
        <ImgContainer :pos="source[`${item}.png`]" />
      </div>
    </div>
  </div>
</template>

<script>
import ImgContainer from './imgContainer'
export default {
  computed: {
    strings() {
      if (!this.value) return []
      return this.value
        .split('')
        .filter((item) => item)
        .map((item) => {
          if (item === '%') return 'ps'
          return item
        })
    }
  },
  props: {
    source: {
      type: Object,
      default: () => ({})
    },

    value: {
      type: String,
      default: ''
    }
  },
  components: {
    ImgContainer
  }
}
</script>
