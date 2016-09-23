# IO^2

## What is this?

So in JavaScript we now have promises, async/await, babelify etc. And I have a problem with these. We still can't cleanly separate pure and impure functions.

## The problem

We want a clean separation of pure and impure functions. In JavaScript your impure functions are callbacks (mostly). A typical scenario -

1. Handle Post request - Impure function
2. Validate Post Input - Pure function
3. Read from DB with input - Impure function
4. Handle DB error - Pure function
5. Do some validation - Pure function
6. Create response and send - Pure function

Typically all the six functions above would have been one impure callback function (callback hell). IO^2 will help you split monolothic callbacks into bite size pieces. Bonus, your pure functions can be easily tested. Another bonus, you write code the way you reason about your program.

## The Solution

```javascript

const IO = require('io-square')
const express = require('express')
const app = express()
 
new IO(callback => app.post('/', callback))                                 // Impure Function
  .reject((req, res) => {                                                   // Pure Function
    if (!req.body.email) {
      res.redirect('/')
      return null
    }
    return [req, res]
  })
  .bind(req => new IO(callback => client.hget(req.body.email, callback)))  // Impure function
  .error(err => {                                                          // Pure function
    res.send({error: true, message: 'Could not get user record from db'})
  })
  .reject((req, res, reply) => {                                           // Pure function
    if (reply.authorised !== true) {
      res.send({error: true, message: 'Not authorised'})
      return null
    }
    return [req, res]
  })
  .then((req, res) => {                                                    // Pure function
    // do something
    req.authSession.email = req.body.email
    res.send({success: true})
  })
```

## Install

    $ npm install io-square --save


## How does it work?

#### Every asynchronous function is wrapped in an IO instance.

    new IO(callback => app.post('/', callback))

Create an instance of an IO Object. Provide the constructor with an io-function. This function should take a result function as the only argument. In the asynchronous call, pass the result function ass the callback.


#### Provide an error function if the result 'maybe' an Error instance

```javascript
  .error(err => {                                                          // Pure function
    res.send({error: true, message: 'Could not get user record from db'})
  })
```


#### Call methods of the IO instance with pure functions

```javascript
  .reject((req, res) => {
    if (!req.body.email) {
      res.redirect('/')
      return null
    }
    return [req, res]
  })
```

#### Available methods

1. __reject__ - will stop propagation if the pure function given returns null. Otherwise passes on the value(s) returned as arguments to the next method. Multiple value should be returned in an Array.
2. __map__ - will take a set of values, modify them, and passes on a new set of values to the next method called.
3. __bind__ - is used to bind another asynchronous (nested) function to the data flow. It takes a function whose arguments are the values passed and whose return value is a new IO instance. It will pass a new set of arguments to the next method. The original args passed to it + the arguments passed to the new IO instance callback. Look at this carefully in the bind example above.
4. __then__ - is the final method you must always call. This will activate the whole flow. __then__ cannot be called multiple times. It is always the final call.
