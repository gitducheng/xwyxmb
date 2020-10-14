import Hilo from 'hilojs'
import source from '~/static/source.json'
import GameText from "./text";

export default class InitGame {
  constructor ({ container, configData, callback = () => { }, startGame = () => { } }) {
    if (!configData) { return false }
    // 数据处理
    this.container = container
    this.title = configData.title


    // 资源下载
    this.quene = this.loadQuene(() => {


      // // 场景处理
      this.stage = this.initStage(true)
      this.ticker = this.initTicker()

      this.initTitle()


      this.startBtn = this.getSourceBitmap('start', { x: 820, y: 864 }).addTo(this.stage)
      this.startBtn.on(Hilo.event.POINTER_START, e => {
        startGame()
      })


      this.ticker.nextTick(() => {
        callback(this)
      })
    })

  }

  loadQuene (callback) {
    const quene = new Hilo.LoadQueue()
    quene.add(Object.values(source))
    quene.on('complete', () => {
      callback()
    })
    quene.start()
    return quene
  }

  initStage (bg) {
    const width = 1920
    const height = 1080
    const scaleX = innerWidth / width
    const scaleY = innerHeight / height

    const stage = new Hilo.Stage({
      renderType: 'canvas',
      container: this.container,
      width, height, scaleX, scaleY
    })

    window.onresize = () => {
      stage.scaleX = innerWidth / width
      stage.scaleY = innerHeight / height
      stage.resize(width, height, true)
    }


    function touchHandler (event) {
      var touches = event.changedTouches,
        first = touches[0],
        type = "";
      switch (event.type) {
        case "touchstart":
          type = "mousedown";
          break;
        case "touchmove":
          type = "mousemove";
          break;
        case "touchend":
          type = "mouseup";
          break;
        default:
          return;
      }

      // initMouseEvent(type, canBubble, cancelable, view, clickCount, 
      //                screenX, screenY, clientX, clientY, ctrlKey, 
      //                altKey, shiftKey, metaKey, button, relatedTarget);

      var simulatedEvent = document.createEvent("MouseEvent");
      simulatedEvent.initMouseEvent(type, true, true, window, 1,
        first.screenX, first.screenY,
        first.clientX, first.clientY, false,
        false, false, false, 0 /*left*/, null);

      first.target.dispatchEvent(simulatedEvent);
    }

    function init () {
      //   console.log('convert touch to mouse');
      document.addEventListener("touchstart", touchHandler, true);
      document.addEventListener("touchmove", touchHandler, true);
      document.addEventListener("touchend", touchHandler, true);
      document.addEventListener("touchcancel", touchHandler, true);
    }

    if (Hilo.event.POINTER_START == "mousedown") {
      init();
    }
    stage.enableDOMEvent(Hilo.event.POINTER_START, true)
    // stage.enableDOMEvent(Hilo.event.POINTER_MOVE,true)
    // stage.enableDOMEvent(Hilo.event.POINTER_END,true)

    if (bg) {
      this.getSourceBitmap('background').addTo(stage)
    }

    return stage
  }
  initTicker () {
    // ticker刷新舞台
    const ticker = new Hilo.Ticker(60)
    ticker.addTick(this.stage)
    ticker.addTick(Hilo.Tween)
    ticker.start()
    return ticker
  }
  initTitle (bg) {
    let fontSize = 60
    // if (this.title.length > 8) { fontSize = Math.floor(420 / this.title.length) }
    const title = new GameText({
      text: this.title,
      fontSize,
      lineHeight: fontSize + 20,
      bold: true,
      color: '#012d5f',
      reTextWidth: 1500,
      // background: 'red',
      // x: (1500 - fontSize * this.title.length) / 2
    })
    title.width = 1500
    title.textAlign = 'center'

    const container = new Hilo.Container({
      width: 1500,
      height: 300,
      // x: (this.stage.width - 1500) / 2,
      // y: (this.stage.height - 300) / 2,
      align: Hilo.align.CENTER,
      // background: '#ccc',
      children: [title],
    }).addTo(this.stage)

    return container
  }




  // initResultTip(data) {
  //     const id=data? 'successful':'wrong'
  //     const tip=this.getSourceBitmap(id).addTo(this.stage)
  //     this.ticker.timeout(() => {
  //         this.stage.removeChild(tip)
  //     },2000)
  // }

  getSourceBitmap (id, properties) {
    return new Hilo.Bitmap({ image: this.quene.get(id).content, rect: this.quene.get(id).rect, ...properties })
  }
}