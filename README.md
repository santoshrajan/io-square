# IO^2

## What is this?

Right. So in JavaScript we now have promises, async/await, babelify etc. And I have a problem with these. If you don't have a problem with these, then probably, there is not much here for you.

## The problem

I want a clean separation of pure and impure functions. In JavaScript your impure functions are callbacks (mostly). A typical scenario -

1. Handle Post request - Impure function
2. Validate Post Input - Pure function
3. Read from DB with input - Impure function
4. Handle DB error - Pure function
5. Do some validation - Pure function
6. Create response and send - Pure function

Typically all the six functions above would have been one impure callback function (callback hell). IO^2 will help you split monolothic callbacks into bite size pieces. Bonus, your pure functions can be easily tested.

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
  .reject((req, res, error, reply) => {                                    // Pure function
    if (error) {
      res.send({error: true, message: 'Could not get user record from db'})
      return null
    }
    return [req, res, reply]
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


