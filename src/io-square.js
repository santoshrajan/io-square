
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
        cb(...transform(...args))
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

}

module.exports = IO
