
const IO = require('../lib/io-square')
const fs = require('fs')

new IO(callback => fs.readFile('test/test.js', callback))
  .reject((error, data) => error ? null : [data])
  .map(data => [data.toString()])
  .bind(() => new IO(cb => fs.readFile('test/test.js', cb)))
  .then((data, error, newData) => console.log(data + newData.toString()))
