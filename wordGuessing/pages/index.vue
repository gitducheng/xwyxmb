<template>
  <div id="root"
       ref="root"></div>
</template>

<script>
import defaultData from '~/static/defaultData'
import InitGame from "@/assets/game"

export default {
  name: 'Root',
  data() {
    return {
      configData: null,
    }
  },
  async mounted() {
    await this.getConfigData()
    if(!this.configData) {this.$router.replace('/config')}
    new InitGame({container: this.$refs.root,configData: this.configData})
  },
  methods: {
    async getConfigData() {
      try {
        const result=await this.$testload()
        if(typeof result==='string') {
          this.configData=JSON.parse(result||null)
        }
      } catch(error) {
        this.configData=JSON.parse(localStorage.getItem('guessWordData')||null)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  text-align: center;
  width: 100%;
  height: 100%;
  background: url("/img/img-background.jpg") no-repeat center;
  background-size: cover;

  &__header {
  }
  &__title {
    color: #fff;
    height: 80px;
    margin-top: 1.5rem;
  }

  &__commit {
    background: url(/img/icon-sprite.png) no-repeat 0 0;
    background-size: 400px 250px;
    width: 130px;
    height: 43px;
    border: none;
    transform: scale(1);
    &:hover {
      transform: scale(1.3);
    }
  }

  &__audio {
    position: fixed;
    top: 43%;
    left: 23%;
    width: 35%;
  }

  audio,
  video,
  audio:hover,
  video:hover,
  audio:active,
  video:active,
  audio:visited,
  video:visited,
  audio:link,
  video:link,
  audio:focus,
  video:focus {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        -webkit-tap-highlight-color: transparent;
        outline: none;
        background: none;
        text-decoration: none;
    border: none;
  }
}
</style>
