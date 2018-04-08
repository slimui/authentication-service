const { promisify } = require('util')
const { ObjectID } = require('mongodb')
const Joi = require('joi')
const bcrypt = require('bcryptjs')
const {
  validate,
  parseValidationErrorMessage,
} = require('./utils')
const compare = promisify(bcrypt.compare)

const schema = Joi.object()
  .keys({
    email: Joi.string(),
    id: Joi.string(),
    password: Joi.string().required(),
    productName: Joi.string(),
    productToken: Joi.string(),
    moderatorName: Joi.string(),
    moderatorSecret: Joi.string(),
  })
    .xor('email', 'id')
    .xor('productToken', 'moderatorName')
    .with('moderatorName', 'moderatorSecret')

    const sendFailedResponse = ({ res, id, email }) => res.status(400).send({
      success: false,
      message: 'Could authenticate with credentials',
    })

module.exports = ({ collectionClient }) => async (req, res) => {
  try {
    await validate({
      value: req.body,
      schema
    })
  } catch (error) {
    res.status(400).send({
      success: false,
      message: parseValidationErrorMessage({ error }),
    })
  }
  const {
    email,
    id,
    password,
    productName,
    productToken,
    moderatorName,
    moderatorSecret
  } = req.body
  let query
  if (email) {
    query = { email }
  } else {
    query = {
      _id: ObjectID(id),
    }
  }
  const account = await collectionClient.findOne(query)
  if (!account) {
    return res.status(400).send({
      success: false,
      message: `Could not find account with ${ email ? 'email' : 'id' }: ${ email ? email : id }`
    })
  } else {
    // check password matches
    if (!await compare(password, account.password)) {
      return sendFailedResponse({ res, email, id })
    }
    // check product name exists
    if (!Object.keys(account.productlinks).includes(productName)) {
      return sendFailedResponse({ res, email, id })
    }
    // if productToken check product token matches
    if (productToken &&
      productToken !== account.productlinks[productName].productToken) {
      return sendFailedResponse({ res, email, id })
    }
    if (moderatorName &&
      moderatorName !== process.env.MODERATOR_APP_NAME &&
      moderatorSecret !== process.env.MODERATOR_APP_SECRET) {
      return sendFailedResponse({ res, email, id })
    }
    res.send({
      success: true,
      foreignKey: account.productlinks[productName].foreignKey,
      productToken: account.productlinks[productName].productToken,
    })
  }
}
