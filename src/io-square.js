
class IO {

  constructor (ioFunc) {
    this.then = cb => ioFunc((...args) => {
      if (args[0] instanceof Error) {
        this.err(args[0])
      } else {
        cb(...args)
      }
    })
    this.err = e => console.log(e.message)
  }

  error (handler) {
    this.err = handler
    return this
  }

  reject (pred) {
    let saveThen = this.then
    this.then = cb => {
      saveThen((...args) => {
        let result = pred(...args)
        if (result !== null) {
          if (Array.isArray(result)) {
            cb(...result)
          } else {
            cb(result)
          }
        }
      })
    }
    return this
  }

  map (transform) {
    let saveThen = this.then
    this.then = cb => {
      saveThen((...args) => {
        let result = transform(...args)
        if (Array.isArray(result)) {
          cb(...result)
        } else {
          cb(result)
        }
      })
    }
    return this
  }

  bind (ioFunc) {
    let saveThen = this.then
    this.then = cb => {
      saveThen((...args) => {
        let io = ioFunc(...args)
        io.then((...ioargs) => cb(...args, ...ioargs))
      })
    }
    return this
  }

  static timer (s) {
    var intervalId
    var timer = new IO(cb => {
      intervalId = setInterval(cb, Math.floor(s * 1000))
    })
    timer.clear = () => clearInterval(intervalId)
    return timer
  }

}

module.exports = IO
