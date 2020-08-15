import Hilo from 'hilojs'
import { fontFamily, gameWidth } from '../utils/constants'

const TimeIsUpScene = Hilo.Class.create({
  Extends: Hilo.Container,
  constructor(properties) {
    TimeIsUpScene.superclass.constructor.call(this, properties)
    this.init(properties)
  },

  displayTimestamp: 0, // 开始显示时间、需3秒后隐藏此页面

  onUpdate() {
    if (this.visible && +new Date() - this.displayTimestamp > 3000) {
      this.fire('hide-me')
    }
  },

  init({ assets, config }) {
    // 顶部
    const topBanner = new Hilo.Bitmap({
      image: assets.getContent('playing-top-banner'),
    }).addTo(this)
    const pause = new Hilo.Bitmap({
      image: assets.getContent('pause'),
    }).addTo(this)
    const subjectText = new Hilo.Text({
      font: 'bold 50px ' + fontFamily,
      text: config.subject,
      textAlign: 'center',
      color: '#ffffff',
      lineSpacing: 0,
      width: 500,
      maxWidth: 500,
      height: 60,
    }).addTo(this)
    const timeText = new Hilo.Text({
      font: 'bold 39px ' + fontFamily,
      text: '00 : 00',
      textAlign: 'center',
      color: '#eb4918',
      lineSpacing: 0,
      width: 200,
      height: 60,
    }).addTo(this)

    // Time's up
    const timeIsUp = new Hilo.Bitmap({
      image: assets.getContent('time-is-up'),
    }).addTo(this)

    topBanner.x = gameWidth / 2 - topBanner.width / 2
    topBanner.y = 35
    pause.x = topBanner.x + 430
    pause.y = topBanner.y + 146
    subjectText.x = topBanner.x + 146
    subjectText.y = topBanner.y + 60
    timeText.x = topBanner.x + 250
    timeText.y = topBanner.y + 154
    timeIsUp.x = gameWidth / 2 - timeIsUp.width / 2
    timeIsUp.y = topBanner.y + topBanner.height + 254

    // 事件
    // startButton.on(Hilo.event.POINTER_START, () => {
    //   this.fire('start')
    // })
  },

  hide() {
    this.visible = false
  },

  show() {
    this.visible = true
    this.displayTimestamp = +new Date()
  },
})

export default TimeIsUpScene
