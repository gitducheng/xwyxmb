export function randomArray(arr) {
  var len = arr.length
  for (var i = 0; i < len - 1; i++) {
    var index = parseInt(Math.random() * (len - i))
    var temp = arr[index]
    arr[index] = arr[len - i - 1]
    arr[len - i - 1] = temp
  }
  return arr
}
