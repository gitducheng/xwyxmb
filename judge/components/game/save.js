import AssetsFectory from '~/components/game/lib/Asset'
import StageFectory from '~/components/game/stage'
import ExportScence from '~/components/game/exportScence'

export default async function init(second) {
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
    preview: true,
    questions: { second },
    backgroundPos: layout['game-stop']['游戏预览.png'],
    visible: true
  })

  stage.addChild(exportScence)
  return new Promise((re) => {
    ticker.nextTick(() => {
      re(stage.canvas.toDataURL('image/png'))
    })
  })
}
