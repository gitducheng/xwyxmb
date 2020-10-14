import Hilo from 'hilojs'

/**
 * 获取静态资源
 * @returns {Promise<LoadQueue>}
 */
export default function () {
  return new Promise((resolve) => {
    const queue = new Hilo.LoadQueue()
    queue.add([
      { id: 'bg', src: 'images/bg.jpg' },
      { id: 'ready', src: 'images/ready.png' },
      { id: 'orangeBalloonMonster', src: 'images/orange-balloon-monster.png' },
      { id: 'greenBalloonMonster', src: 'images/green-balloon-monster.png' },
      { id: 'greenBalloonMonster', src: 'images/green-balloon-monster.png' },
      { id: 'button-bg', src: 'images/button-bg.png' },
      { id: 'difficulty-bg', src: 'images/difficulty-bg.png' },
      { id: 'star', src: 'images/star.png' },
      { id: 'star-gray', src: 'images/star-gray.png' },
      { id: 'playing-left-banner', src: 'images/playing-left-banner.png' },
      { id: 'playing-right-banner', src: 'images/playing-right-banner.png' },
      { id: 'playing-top-banner', src: 'images/playing-top-banner.png' },
      { id: 'time-is-up', src: 'images/time-is-up.png' },
      { id: 'green-up-monster', src: 'images/green-up-monster.png' },
      { id: 'orange-up-monster', src: 'images/orange-up-monster.png' },
      { id: 'green-down-monster', src: 'images/green-down-monster.png' },
      { id: 'orange-down-monster', src: 'images/orange-down-monster.png' },
      { id: 'orange-blowup', src: 'images/orange-blowup.png' },
      { id: 'green-blowup', src: 'images/green-blowup.png' },
      { id: 'score-draw-header', src: 'images/score-draw-header.png' },
      { id: 'score-failed-header', src: 'images/score-failed-header.png' },
      { id: 'score-green-avatar', src: 'images/score-green-avatar.png' },
      { id: 'score-orange-avatar', src: 'images/score-orange-avatar.png' },
      { id: 'score-win-header', src: 'images/score-win-header.png' },
      { id: 'score-bg', src: 'images/score-bg.png' },
      { id: 'score-summary-bg', src: 'images/score-summary-bg.png' },
      { id: 'score-star', src: 'images/score-star.png' },
      { id: 'score-button-bg', src: 'images/score-button-bg.png' },
      { id: 'score-count-bg', src: 'images/score-count-bg.png' },
      { id: 'pause', src: 'images/pause.png' },
      { id: 'paused-bg', src: 'images/paused-bg.png' },
      { id: 'paused-button-bg', src: 'images/paused-button-bg.png' },
    ])
    queue.on('complete', function () {
      resolve(queue)
    })
    queue.start()
  })
}
