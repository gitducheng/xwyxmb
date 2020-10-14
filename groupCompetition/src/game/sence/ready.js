import Hilo from 'hilojs'
import { gameWidth, gameHeight } from '../utils/constants'

const ReadyScene = Hilo.Class.create({
  Extends: Hilo.Container,
  // Mixes: Hilo.EventMixin,
  constructor(properties) {
    ReadyScene.superclass.constructor.call(this, properties)
    this.init(properties)
  },

  init(properties) {
    // 准备Get Ready!
    const getReady = new Hilo.Bitmap({
      id: 'ready',
      image: properties.assets.getContent('ready'),
    })

    // 确定getReady的位置
    getReady.x = (gameWidth - getReady.width) / 2
    getReady.y = (gameHeight - getReady.height) / 2

    // 准备按钮事件
    getReady.on(Hilo.event.POINTER_START, () => {
      this.fire('ready')
    })

    this.addChild(getReady)
  },

  show() {
    this.visible = true
  },

  hide() {
    this.visible = false
  },
})

export default ReadyScene
