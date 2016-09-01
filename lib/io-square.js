
class IO {

  constructor (cb = null) {
    this._cb = cb
  }

  then (f) {
    this._cb(f)
  }

  reject (pred) {
    return new IO(cb => {
      this.then((...args) => {
        if (!pred(...args)) {
          cb(...args)
        }
      })
    })
  }

  map (transform) {
    return new IO(cb => {
      this.then((...args) => {
        cb(transform(...args))
      })
    })
  }

  bind (dataToIO) {
    return new IO(cb => {
      this.then((...args) => {
        dataToIO(...args, cb)
      })
    })
  }

}

module.exports = IO
