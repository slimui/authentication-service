const express = require('express')
const bodyParser = require('body-parser')
const { MongoClient } = require('mongodb')
const { promisify } = require('util')
const create = require('./create')
const productlinksCreate = require('./productlinksCreate')
const get = require('./get')
const app = express()
app.use(bodyParser.json())

const promisifiedMongoClient = promisify(MongoClient)

const initDB = async () => {
  const client = await promisifiedMongoClient.connect(process.env.MONGO_URL)
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
  app.listen(80, () => console.log('Started listening on port 80'))
}

main()
