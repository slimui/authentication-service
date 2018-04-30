const express = require('express')
const mongoose = require('mongoose')
const AuthenticationAccountModel = require('./authenticationAccountModel')
const createUser = require('./createUser')
const getUser = require('./getUser')
const createProductlink = require('./createProductlink')
const removeProductlink = require('./removeProductlink')
const updatePassword = require('./updatePassword')
const startPasswordReset = require('./startPasswordReset')
// const passwordResetComplete = require('./passwordResetComplete')
// const verify = require('./verify')
const { rpc, method } = require('@bufferapp/micro-rpc')
const app = express()

const initDB = async () => {
  await mongoose.connect(process.env.MONGO_URL)
  return {
    AuthenticationAccountModel: AuthenticationAccountModel({
      mongooseConnection: mongoose,
    }),
  }
}

const main = async () => {
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
    )(req, res).catch(err => next(err))
  })
  app.listen(80, () => console.log('Started listening on port 80'))
}

main()
