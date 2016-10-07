
const IO = require('../lib/io-square')

const fs = require('fs')

const readFile = filename => {
  return new IO(cb =>
    fs.readFile(filename,
      (err, data) => err ? cb(err) : cb(data)))
}

readFile('test/test.js')
  .error(e => console.log('first file err ' + e.message))
  .map(data => data.toString())
  .bind(() => readFile('test/test.js'))
  .then((data, newData) => console.log(data + newData.toString()))
