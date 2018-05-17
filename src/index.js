const express = require('express')
const mongoose = require('mongoose')
const logMiddleware = require('@bufferapp/logger/middleware')
const connectDatadog = require('@bufferapp/connect-datadog')
const { StatsD } = require('node-dogstatsd')
const AuthenticationAccountModel = require('./authenticationAccountModel')
const createUser = require('./createUser')
const getUser = require('./getUser')
const createProductlink = require('./createProductlink')
const removeProductlink = require('./removeProductlink')
const updatePassword = require('./updatePassword')
const startPasswordReset = require('./startPasswordReset')
const completePasswordReset = require('./completePasswordReset')
const verifyUser = require('./verifyUser')
const { rpc, method } = require('@bufferapp/micro-rpc')
const app = express()

const isProduction = process.env.NODE_ENV === 'production'
app.set('isProduction', isProduction)

if (isProduction) {
  const dogstatsd = new StatsD('dd-agent.default')
  app.use(
    connectDatadog({
      dogstatsd,
      response_code: true,
      bufferRPC: true,
      tags: [
        'app:authentication-service',
        `track:${process.env.RELEASE_TRACK || 'dev'}`,
      ],
    }),
  )
}

const initDB = async () => {
  await mongoose.connect(process.env.MONGO_URL)
  return {
    AuthenticationAccountModel: AuthenticationAccountModel({
      mongooseConnection: mongoose,
    }),
  }
}

const main = async () => {
  if (process.env.NODE_ENV !== 'test') {
    app.use(logMiddleware({ name: 'AuthenticationService' }))
  }
  const { AuthenticationAccountModel } = await initDB()
  app.post('/rpc', (req, res, next) => {
    rpc(
      method('createUser', createUser({ AuthenticationAccountModel })),
      method('getUser', getUser({ AuthenticationAccountModel })),
      method(
        'createProductlink',
        createProductlink({ AuthenticationAccountModel }),
      ),
      method(
        'removeProductlink',
        removeProductlink({ AuthenticationAccountModel }),
      ),
      method('updatePassword', updatePassword({ AuthenticationAccountModel })),
      method(
        'startPasswordReset',
        startPasswordReset({ AuthenticationAccountModel }),
      ),
      method(
        'completePasswordReset',
        completePasswordReset({ AuthenticationAccountModel }),
      ),
      method('verifyUser', verifyUser({ AuthenticationAccountModel })),
    )(req, res).catch(err => next(err))
  })
  app.listen(80, () => console.log('Started listening on port 80'))
}

main()
