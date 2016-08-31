
const IO = require('../lib/io-square')
const fs = require('fs')

new IO(next => {
  fs.readFile('test/test.js', (error, data) => {
    next({error: error, data: data})
  })
})
.reject(data => {
  if (data.error) {
    console.log('error')
    return true
  } else {
    return false
  }
})
.map(data => data.data.toString())
.bind((prevdata, next) => {
  fs.readFile('test/test.js', (error, data) => {
    next(prevdata + data.toString())
  })
})
.next(data => console.log(data))
