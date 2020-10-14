import Hilo from 'hilojs'
import Card from './card'
import Card1 from './card1'
import Card2 from './card2'

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

    let currentCard = Card
    let cardWidth = 306+42
    if (this.questions.length < 4) {
      currentCard = Card1
      cardWidth = 485+42
      this.height=489
    } else if (this.questions.length === 4) {
      currentCard = Card2
      cardWidth = 375+42
      this.height=390
    }

    for (let i = 0; i < this.questions.length; i++) {
      if (i <= 3) {
        row1.questions = this.questions[i]
        new currentCard(row1).addTo(this)
        row1.x += cardWidth
        this.width += cardWidth
      } else {
        row2.questions = this.questions[i]
        new currentCard(row2).addTo(this)
        row2.x += cardWidth
        this.height = cardWidth * 2
      }
    }
  }
}
