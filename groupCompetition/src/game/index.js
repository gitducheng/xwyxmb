import Hilo from "hilojs";
import loadAssets from "./utils/loadAssets";
import DifficultyScene from "./sence/difficulty";
import PlayingScene from "./sence/playing";
import TimeIsUpScene from "./sence/timeIsUp";
import ScoreScene from "./sence/score";
import ReadyScene from "./sence/ready";
import { gameWidth, gameHeight } from "./utils/constants";

// 游戏
let config = null;
let router = null;
let assets = null;
let stage = null;
// playing / over
// let state = null
let score = null;
let play = false;

let readyScene = null;
let difficultyScene = null;
let playingScene = null;
let timeIsUpScene = null;
let scoreScene = null;

let app = null;

export function initGame({
  container,
  config: initData,
  router: currentRouter,
  autoPlay,
  app: vueApp
}) {
  config = initData;
  play = autoPlay;
  router = currentRouter;
  app = vueApp;

  // 加载静态资源
  loadAssets().then(result => {
    assets = result;
    createStage(container);
  });

  window.addEventListener("resize", () => {
    requestAnimationFrame(() => {
      if (stage) {
        stage.scaleX = innerWidth / gameWidth;
        stage.scaleY = innerHeight / gameHeight;
        // this.stage.resize(gameWidth, gameHeight, true)
        stage.updateViewport();
      }
    });
  });

  app.$on("back2score", () => {
    scoreScene.visible = true; // 不使用show，避免清空得分
  });
}

/**
 * 搭建舞台
 */
function createStage(container) {
  stage = new Hilo.Stage({
    renderType: "canvas",
    // renderType: 'dom',
    container: container,
    width: gameWidth,
    height: gameHeight,
    scaleX: innerWidth / gameWidth,
    scaleY: innerHeight / gameHeight
  });

  // 启动计时器
  const ticker = new Hilo.Ticker(60);
  ticker.addTick(stage);
  ticker.start(true);

  // 设置背景
  const bgImg = assets.getContent("bg");
  new Hilo.Bitmap({
    id: "bg",
    image: bgImg
  }).addTo(stage);

  //绑定交互事件
  function touchHandler(event) {
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
    simulatedEvent.initMouseEvent(
      type,
      true,
      true,
      window,
      1,
      first.screenX,
      first.screenY,
      first.clientX,
      first.clientY,
      false,
      false,
      false,
      false,
      0 /*left*/,
      null
    );

    first.target.dispatchEvent(simulatedEvent);
  }

  function init() {
    console.log("convert touch to mouse");
    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", touchHandler, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);
  }

  if (Hilo.event.POINTER_START == "mousedown") {
    init();
  }

  // 绑定事件
  stage.enableDOMEvent(Hilo.event.POINTER_START, true);
  // stage.on(Hilo.event.POINTER_START, handleUserInput)

  // 游戏场景
  initScenes();

  // 初始化
  reset();
}

/**
 * 初始化场景
 */
function initScenes() {
  // 准备场景
  readyScene = new ReadyScene({
    id: "readyScene",
    width: gameWidth,
    height: gameHeight,
    assets,
    visible: false
  }).addTo(stage);

  // 查看难度
  difficultyScene = new DifficultyScene({
    id: "difficultyScene",
    width: gameWidth,
    height: gameHeight,
    assets,
    config,
    visible: false
  }).addTo(stage);

  // 开始游戏
  playingScene = new PlayingScene({
    id: "playingScene",
    width: gameWidth,
    height: gameHeight,
    assets,
    config,
    visible: false
  }).addTo(stage);

  // 游戏时间到
  timeIsUpScene = new TimeIsUpScene({
    id: "timeIsUpScene",
    width: gameWidth,
    height: gameHeight,
    assets,
    config,
    visible: false
  }).addTo(stage);

  // 得分
  scoreScene = new ScoreScene({
    id: "scoreScene",
    width: gameWidth,
    height: gameHeight,
    assets,
    config,
    visible: false
  }).addTo(stage);

  // --- 绑定事件 ---
  // 准备按钮
  readyScene.on("ready", () => {
    readyScene.hide();
    difficultyScene.show();
  });
  // 开始按钮
  difficultyScene.on("start", () => {
    difficultyScene.hide();
    playingScene.show();
  });
  // 游戏时间到
  playingScene.on("time-is-up", e => {
    playingScene.hide();
    timeIsUpScene.show();
    score = e.detail;
  });
  playingScene.on("restart", e => {
    router.push({ query: { replay: 1 } });
    window.location.reload();
  });
  // 游戏正常结束
  // playingScene.on('game-over', () => {
  //   playingScene.hide()
  //   timeIsUpScene.show()
  //   console.log('timeIsUpScene show')
  // })
  // 计时结束
  timeIsUpScene.on("hide-me", () => {
    timeIsUpScene.hide();
    scoreScene.show(score);
  });
  // 得分界面
  scoreScene.on("check-answer", () => {
    scoreScene.visible = false; // 不使用hide，避免清空得分
    app.showResult(score);
  });
  scoreScene.on("restart", () => {
    // scoreScene.hide()
    // playingScene.show()
    router.push({ query: { replay: 1 } });
    window.location.reload();
  });
  // 绑定开始按钮事件
  // this.gameOverScene.getChildById('start').on(Hilo.event.POINTER_START, function(e) {
  //   e.stopImmediatePropagation && e.stopImmediatePropagation();
  //   this.gameReady();
  // }.bind(this));
}

/**
 * 处理用户事件
 */
// function handleUserInput(e) {
//   if (state !== 'over') {
//     // 启动游戏
//     if (state !== 'playing') start()
//     // 控制怪兽往上飞
//     // this.bird.startFly()
//   }
// }

function reset() {
  score = null;
  // if (process.env.NODE_ENV === 'development') {
  //   play = true
  // }
  if (play) {
    playingScene.show();
  } else {
    readyScene.show();
  }
  difficultyScene.hide();
  timeIsUpScene.hide();
  scoreScene.hide();
}
