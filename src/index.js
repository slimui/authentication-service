const express = require('express')
const bodyParser = require('body-parser')
const { MongoClient } = require('mongodb')
const { promisify } = require('util')
const create = require('./create')
const productlinksCreate = require('./productlinksCreate')
const productlinksRemove = require('./productlinksRemove')
const get = require('./get')
const passwordUpdate = require('./passwordUpdate')
const passwordResetStart = require('./passwordResetStart')
const passwordResetComplete = require('./passwordResetComplete')
const verify = require('./verify')
const app = express()
app.use(bodyParser.json())

const promisifiedMongoClient = promisify(MongoClient)

const initDB = async () => {
  const client = await promisifiedMongoClient.connect(process.env.MONGO_URL)
  // TODO: check if index exists first
  const collectionClient = client.db(process.env.MONGO_DB).collection('authenticationAccounts')
  await collectionClient.createIndex({ email: 1 }, { unique: 1 })
  return {
    collectionClient,
  }
}

const main = async () => {
  const { collectionClient } = await initDB()
  app.post('/api/create', create({ collectionClient }))
  app.post('/api/get', get({ collectionClient }))
  app.post('/api/productlinks/create', productlinksCreate({ collectionClient }))
  app.post('/api/productlinks/remove', productlinksRemove({ collectionClient }))
  app.post('/api/password/update', passwordUpdate({ collectionClient }))
  app.post('/api/password/reset/start', passwordResetStart({ collectionClient }))
  app.post('/api/password/reset/complete', passwordResetComplete({ collectionClient }))
  app.post('/api/verify', verify({ collectionClient }))
  app.listen(80, () => console.log('Started listening on port 80'))
}

main()
