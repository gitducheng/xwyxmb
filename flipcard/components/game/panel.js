import Hilo from 'hilojs'
import Card from './card'

export default class Main extends Hilo.Container {
  constructor (properties) {
    super(properties)
    this.questions = properties.questions || []
    this.align = Hilo.align.CENTER
    // this.background = 'pink'
    this.width = 0
    this.height = 326

    this.init(properties)
  }

  init (properties) {
    const { backgroundPos } = properties || {}

    let row1 = {
      x: 0,
      y: 0,
      questions: {},
      backgroundPos,
    }
    let row2 = {
      x: 0,
      y: 336,
      questions: {},
      backgroundPos,
    }

    for (let i = 0; i < this.questions.length; i++) {
      if (i <= 3) {
        row1.questions = this.questions[i]
        new Card(row1).addTo(this)
        row1.x += 348
        this.width += 348
      } else {
        row2.questions = this.questions[i]
        new Card(row2).addTo(this)
        row2.x += 348
        this.height = 326 * 2
      }
    }
  }
}
