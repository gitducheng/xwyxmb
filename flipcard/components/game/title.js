import Hilo from 'hilojs'
import Text from './text'

export default class Title extends Hilo.Container {
  constructor (properties) {
    super(properties)
    this.x = properties.x
    this.y = properties.y

    this.init(properties)
  }

  init (properties) {
    const { backgroundPos, title } = properties || {}

    const gameTitle = new Hilo.Bitmap({
      x: 0,
      y: 0,
      width: backgroundPos.width,
      height: backgroundPos.height,
      image: backgroundPos.image,
      visible: true
    }).addTo(this)

    new Text({
      text: title || '翻翻卡游戏',
      fontSize: 36,
      lineHeight: 36,
      bold: true,
      textAlign: 'center',
      textVAlign: 'middle',
      height: 116,
      reTextWidth: 250,
      x: 112,
      y: 10,
      color: '#ffffff'
    }).addTo(this)
  }
}
