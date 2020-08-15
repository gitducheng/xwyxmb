<template>
  <div
    class="app-home"
  >
    <div
      ref="container"
      class="container"
    />
    <result
      v-if="resultVisible"
      :config="config"
      :score="score"
      @back2score="back2score"
    />
  </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty'
import Noty from 'noty'
import { load } from '../utils/container'
import { initGame } from '../game'
import Result from '../components/Result'

export default {
  name: 'Home',
  components: { Result },
  data() {
    return {
      config: {},
      assets: null,
      stage: null,
      score: {},
      resultVisible: false,
    }
  },
  created() {
    load().then((data) => {
      if (isEmpty(data)) {
        this.$router.push({ name: 'Config' })
      } else {
        this.config = data
        const autoPlay = !!this.$route.query.replay
        // 创建游戏
        initGame({
          autoPlay,
          router: this.$router,
          container: this.$refs.container,
          config: this.config,
          app: this,
        })
        if (autoPlay) {
          this.$router.push({ query: {} })
        }
      }
    }, (err) => {
      new Noty({
        type: 'warning',
        text: err.toString(),
        layout: 'topCenter',
        timeout: 2000,
      }).show()
      this.$router.push({ name: 'Config' })
    })
  },
  mounted() {
  },
  methods: {
    showResult(score) {
      this.score = score
      this.resultVisible = true
    },
    back2score() {
      this.resultVisible = false
      this.$emit('back2score')
    },
  },
}
</script>
