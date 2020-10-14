<template>
  <div>
    <div class="container"
         ref="container"></div>
  </div>
</template>

<script>
import Hilo from 'hilojs'
import AssetsFectory from '~/components/game/lib/Asset'
import StageFectory from '~/components/game/stage'
import ExportScence from '~/components/game/exportScence'
import Panel from '~/components/game/panel'
import Title from '~/components/game/title'

export default {
  data () {
    return {}
  },
  async mounted () {
    let configData
    try {
      configData = await this.$testload()
      if (typeof configData === 'string') {
        configData = JSON.parse(configData || null)
      }
    } catch (error) {
      configData = JSON.parse(localStorage.getItem('configData') || null)
    }
    if (!configData || configData.name !== 'flipcard') return this.$router.replace('/config')
    this.questions = configData.data

    // const  // 接入hilo动画引擎
    const Assets = AssetsFectory()
    const assets = new Assets()
    assets.on('load', (e) => {
      const num =
        +(e.target.queue.getLoaded() / e.target.queue.getTotal()).toFixed(2) *
        50
      // console.log(num)
    })
    const {
      spsource: { layout }
    } = await assets.load()

    const gameMain = StageFectory()
    this.$refs['container'].appendChild(gameMain.stage.canvas)
    const { stage, ticker } = gameMain

    const exportScence = new ExportScence({
      x: 0,
      y: 0,
      backgroundPos: layout['game-bj']['游戏背景.png'],
      visible: true
    })

    const title = new Title({
      x: 46,
      y: 30,
      backgroundPos: layout['game-title']['游戏标题.png'],
      title: configData.title,
      visible: true
    })

    let quan = layout['game-card']['游泳圈.png']
    if (this.questions.length < 4) {
      quan = layout['game-card1']['游泳圈1.png']
    } else if (this.questions.length === 4) {
      quan = layout['game-card2']['游泳圈2.png']
    }
    const panel = new Panel({
      x: 0,
      y: 0,
      questions: this.questions,
      backgroundPos: quan,
      visible: true
    })

    stage.addChild(exportScence, title, panel)
  },
}
</script>
