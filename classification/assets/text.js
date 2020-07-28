import Hilo from 'hilojs'
export default class GameText extends Hilo.Text {
  static measureTextWidth = (font, str) => {
    var docElement = document.documentElement,
      fontHeight
    var elem = Hilo.createElement('div', {
      style: { font: font, position: 'absolute' },
      innerHTML: str
    })

    docElement.appendChild(elem)
    fontHeight = elem.offsetWidth
    docElement.removeChild(elem)
    return fontHeight
  }
  static textOverWidth = (font, str, width) => {
    let textWdith = GameText.measureTextWidth(font, str)
    if (textWdith <= width) return str
    let strs = str.split('').reduce((pre, next) => {
      let strW = GameText.measureTextWidth(font, pre)
      let strWNe = GameText.measureTextWidth(font, pre + next)
      if (strW < width && strWNe < width) {
        return pre + next
      }
      return pre
    }, '')
    return strs + '...'
  }
  constructor(properties) {
    const {
      reTextWidth = properties.reTextWidth||750,
      fixIOS = false,
      fontSize = 12,
      lineHeight = 12,
      bold = false
    } = properties
    const fixIOSScale = (fontSize) => {
      return fixIOS && fontSize < 40 ? (1 / 40) * fontSize : 1
    }

    // properties.textAlign = 'center'
    properties.font = `normal ${
      bold ? 'bold' : '400'
    } ${fontSize}px/${lineHeight /
      fixIOSScale(
        fontSize
      )}px Helvetica Neue, Helvetica, Arial, Microsoft Yahei,Hiragino Sans GB, Heiti SC, WenQuanYi Micro Hei, sans-serif`

    properties.scaleX = properties.scaleY = fixIOSScale(fontSize)
    properties.maxWidth = reTextWidth / fixIOSScale(fontSize)
    properties.width = reTextWidth / fixIOSScale(fontSize)
    if (properties.textOverflow) {
      properties.text = GameText.textOverWidth(
        properties.font,
        properties.text || '',
        properties.reTextWidth - properties.fontSize
      )
    }

    super(properties)
  }
}
