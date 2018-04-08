const { ObjectID } = require('mongodb')
const { promisify } = require('util')
const Joi = require('joi')
const bcrypt = require('bcryptjs')
const {
  validate,
  parseValidationErrorMessage,
} = require('./utils')

const hash = promisify(bcrypt.hash)

const schema = Joi.object()
  .keys({
    email: Joi.string(),
    id: Joi.string(),
  })
    .xor('email', 'id')

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
  const { email, id } = req.body
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
    res.send({
      ...account,
      success: true,
      password: undefined,
      productlinks: undefined,
      resetToken: undefined,
      id: account._id,
      _id: undefined,
    })
  }
}
