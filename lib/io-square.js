
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

  bind (dataToIO) {
    return new IO(next => {
      this.next(data => {
        dataToIO(data, next)
      })
    })
  }

}

module.exports = IO
