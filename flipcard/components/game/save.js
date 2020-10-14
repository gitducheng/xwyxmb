import AssetsFectory from '~/components/game/lib/Asset'
import StageFectory from '~/components/game/stage'
import ExportScence from '~/components/game/exportScence'
import Panel from '~/components/game/panel'
import Title from '~/components/game/title'

export default async function init(configData) {
  // const  // 接入hilo动画引擎
  const Assets = AssetsFectory()
  const assets = new Assets()
  assets.on('load', (e) => {
    const num =
      +(e.target.queue.getLoaded() / e.target.queue.getTotal()).toFixed(2) * 50
  })
  const {
    spsource: { layout }
  } = await assets.load()

  const gameMain = StageFectory()

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
    if (configData.data.length < 4) {
      quan = layout['game-card1']['游泳圈1.png']
    } else if (configData.data.length === 4) {
      quan = layout['game-card2']['游泳圈2.png']
    }
  const panel = new Panel({
    x: 0,
    y: 0,
    questions: [...configData.data],
    backgroundPos: quan,
    visible: true
  })

  stage.addChild(exportScence, title, panel)
  return new Promise((re) => {
    ticker.nextTick(() => {
      // re(stage.canvas.toDataURL('image/png'))
       setTimeout(() => {
         re(stage.canvas.toDataURL('image/png'))
       }, 500)
    })
  })
}
