/**
 * 生成随机整数
 * @param min
 * @param max
 */
export default function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}
