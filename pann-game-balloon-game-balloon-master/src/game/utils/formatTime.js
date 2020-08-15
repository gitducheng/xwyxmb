export default function (timer) {
  let minutes = '00'
  let seconds = '00'
  if (timer > 60) {
    minutes = minutes + Math.floor(timer / 60)
    seconds = seconds + timer % 60
  } else {
    seconds = seconds + timer
  }
  return `${minutes.slice(-2)} : ${seconds.slice(-2)}`
}
