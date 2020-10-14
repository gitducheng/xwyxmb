import cloneDeep from 'lodash/cloneDeep'
import getRandomInt from './getRandomNum'

/**
 * 随机排列正确/错误答案
 * @param config
 * @returns {[]}
 */
export default function (config) {
  const result = []
  const { rightList, mixedList } = cloneDeep(config)
  const total = rightList.length + mixedList.length
  for (let i = 0; i < total; i++) {
    // 随机选正确/错误答案
    const pickRight = !mixedList.length ? true : !rightList.length ? false : getRandomInt(0, 1000) % 2 === 0
    const pickIndex = getRandomInt(0, pickRight ? rightList.length : mixedList.length)
    result.push({
      right: pickRight,
      text: pickRight ? rightList[pickIndex] : mixedList[pickIndex],
    })
    if (pickRight) {
      rightList.splice(pickIndex, 1)
    } else {
      mixedList.splice(pickIndex, 1)
    }
  }
  return result
}
