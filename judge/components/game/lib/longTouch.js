export default function() {
  var timeOutEvent = 0 //定时器
  var toucheLength = 0
  //开始按

  const proxyStr = ''
  const { $Hilo } = this
  let sound = null
  const longPress = () => {
    if (timeOutEvent < 200) return
    timeOutEvent = 0
    //执行长按要执行的内容，如弹出菜单

    if (toucheLength >= 2) {
      return
    }
    if (sound) {
      sound._context.resume().then(() => {
        sound.play()
      })
    }

    console.log('长按事件触发发')
  }
  return {
    gtouchstart(e) {
      toucheLength = e.touches.length

      sound = $Hilo.$utils.loadSound({
        src: proxyStr + require('~/static/hd/world2020/5919.mp3')
      })
      timeOutEvent = setTimeout(() => {
        longPress(e)
      }, 500) //这里设置定时器，定义长按500毫秒触发长按事件，时间可以自己改，个人感觉500毫秒非常合适
      // return false
    },
    //手释放，如果在500毫秒内就释放，则取消长按事件，此时可以执行onclick应该执行的事件
    gtouchend(e) {
      clearTimeout(timeOutEvent) //清除定时器
      if (timeOutEvent != 0) {
        //这里写要执行的内容（尤如onclick事件）
        console.log('你这是点击，不是长按')
      }
      // return false
    },
    //如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
    gtouchmove() {
      clearTimeout(timeOutEvent) //清除定时器
      timeOutEvent = 0
    }
  }
  //真正长按后应该执行的内容
}
