const createRequest = (method, url, cb) => {
  const request = new window.XMLHttpRequest()
  request.addEventListener('load', () => {
    if (request.status === 200) {
      cb(request)
    } else {
      cb(new Error(request.statusText))
    }
  })
  request.addEventListener('timeout', () => cb(new Error('Request timed out')))
  request.addEventListener('abort', () => cb(new Error('Request aborted')))
  request.addEventListener('error', () => cb(new Error('Request failed')))
  request.open(method, url)
  return request
}

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

  static get (url) {
    return new IO(cb => {
      const request = createRequest('GET', url, cb)
      request.send()
    }).map(request => request.responseText)
  }

  static del (url) {
    return new IO(cb => {
      const request = createRequest('DELETE', url, cb)
      request.send()
    }).map(request => request.responseText)
  }

  static getJSON (url) {
    return new IO(cb => {
      const request = createRequest('GET', url, cb)
      request.responseType = 'json'
      request.send()
    }).map(request => [request.response])
  }

  static getBlob (url) {
    return new IO(cb => {
      const request = createRequest('GET', url, cb)
      request.responseType = 'blob'
      request.send()
    }).map(request => new window.Blob([request.response]))
  }

  static postJSON (url, obj) {
    return new IO(cb => {
      const request = createRequest('POST', url, cb)
      request.setRequestHeader('Content-Type', 'application/json')
      request.responseType = 'json'
      request.send(JSON.stringify(obj))
    }).map(request => [request.response])
  }

  static putJSON (url, obj) {
    return new IO(cb => {
      const request = createRequest('PUT', url, cb)
      request.setRequestHeader('Content-Type', 'application/json')
      request.responseType = 'json'
      request.send(JSON.stringify(obj))
    }).map(request => [request.response])
  }

  static click (elem) {
    return new IO(cb => elem.addEventListener('click', cb))
  }

  static change (elem) {
    return new IO(cb => elem.addEventListener('change', cb))
      .map(e => e.target.value)
  }

}

module.exports = IO
