import Hilo from 'hilojs'
export default function initStage () {
  let stage = null
  let ticker = null

  let gameWidth = 1920 // Math.min(1920, innerWidth) //1920
  let gameHeight = 1080 // gameWidth / (1920 / 1920) //1920
  let scaleX = innerWidth / 1920
  let scaleY = innerHeight / 1080

  stage = new Hilo.Stage({
    renderType: 'canvas',
    width: gameWidth,
    height: gameHeight,
    // background: 'rgba(255, 187, 57, 1)',
    scaleX: scaleX,
    scaleY: scaleY,
    container: document.createElement('canvas')
  })

  if (Hilo.event.POINTER_START == "touchstart") {
    stage.enableDOMEvent('mousedown', true)
    stage.enableDOMEvent('mousemove', true)
    stage.enableDOMEvent('mouseup', true)
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
    console.log('convert touch to mouse');
    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", touchHandler, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);
  }

  if (Hilo.event.POINTER_START == "mousedown") {
    init();
  }

  stage.enableDOMEvent(Hilo.event.POINTER_START, true)
  stage.enableDOMEvent(Hilo.event.POINTER_MOVE, true)
  stage.enableDOMEvent(Hilo.event.POINTER_END, true)
  window.addEventListener('resize', () => {
    // console.log(innerWidth / 1920, innerHeight / 1080)
    requestAnimationFrame(() => {
      stage.scaleX = innerWidth / 1920
      stage.scaleY = innerHeight / 1080

      stage.resize(gameWidth, gameHeight, true);
      // stage.updateViewport()
    })
  })
  //启动计时器
  ticker = new Hilo.Ticker(500)
  ticker.addTick(Hilo.Tween)
  ticker.addTick(stage)
  ticker.start(true)
  stage.ticker = ticker

  return {
    stage,
    ticker
  }
}