
const IO = require('../lib/io-square')

new IO()
  .readFile('test/test.js')
  .reject(data => {
    if (data.error) {
      console.log('error')
      return true
    } else {
      return false
    }
  })
  .map(data => data.data.toString())
  .next(data => console.log(data))
