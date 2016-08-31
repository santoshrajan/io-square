const fs = require('fs')

class IO {

  constructor (next = null) {
    this._next = next
  }

  readFile (filename) {
    return new IO(next => {
      fs.readFile(filename, (error, data) => {
        next({error: error, data: data})
      })
    })
  }

  next (f) {
    this._next(f)
    return this
  }

  reject (pred) {
    return new IO(next => {
      this.next(data => {
        if (!pred(data)) {
          next(data)
        }
      })
    })
  }

  map (transform) {
    return new IO(next => {
      this.next(data => {
        next(transform(data))
      })
    })
  }

}

module.exports = IO
