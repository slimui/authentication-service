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
    productName: Joi.string().required(),
  })
    .xor('email', 'id')

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
    res.send({
      success: true,
      foreignKey: account.productlinks[productName].foreignKey,
    })
  }
}
