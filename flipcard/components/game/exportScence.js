import Hilo from 'hilojs'
// import Text from './text'
export default class ExportScence extends Hilo.Container {
  constructor(properties) {
    super(properties)
    this.initBg(properties)
  }
  initBg(properties) {
    const { backgroundPos, questions, preview } = properties

    const bg = new Hilo.Bitmap({
      x: 0,
      y: 0,
      image: backgroundPos.image,
      rect: backgroundPos.rect,
      visible: true
    })
    bg.addTo(this, -1)
  }
}
