
class IO {

  constructor (next = null) {
    this._next = next
  }

  next (f) {
    this._next(f)
    return this
  }

  reject (pred) {
    return new IO(next => {
      this.next((...args) => {
        if (!pred(...args)) {
          next(...args)
        }
      })
    })
  }

  map (transform) {
    return new IO(next => {
      this.next((...args) => {
        next(transform(...args))
      })
    })
  }

  bind (dataToIO) {
    return new IO(next => {
      this.next((...args) => {
        dataToIO(...args, next)
      })
    })
  }

}

module.exports = IO
