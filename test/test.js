
const IO = require('../lib/io-square')
const fs = require('fs')

new IO(callback => fs.readFile('test/test.js', callback))
  .reject((error, data) => {
    if (error) {
      console.log('error')
      return true
    } else {
      return false
    }
  })
  .map((error, data) => data.toString())
  .bind((prevdata, next) => {
    fs.readFile('test/test.js', (error, data) => {
      next(prevdata + data.toString())
    })
  })
  .then(data => console.log(data))
