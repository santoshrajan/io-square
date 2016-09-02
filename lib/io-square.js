
class IO {

  constructor (cb = null) {
    this.then = cb
  }

  reject (pred) {
    let saveThen = this.then
    this.then = cb => {
      saveThen((...args) => {
        let result = pred(...args)
        if (result !== null) {
          cb(...result)
        }
      })
    }
    return this
  }

  map (transform) {
    let saveThen = this.then
    this.then = cb => {
      saveThen((...args) => {
        cb(transform(...args))
      })
    }
    return this
  }

  bind (io) {
    let saveThen = this.then
    this.then = cb => {
      saveThen((...args) => {
        io.then((...ioargs) => cb(...args, ...ioargs))
      })
    }
    return this
  }

}

module.exports = IO
