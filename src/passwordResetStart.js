const { ObjectID } = require('mongodb')
const uuid = require('uuid/v4')
const Joi = require('joi')
const {
  validate,
  parseValidationErrorMessage,
} = require('./utils')

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
  const resetToken = uuid()
  const result = await collectionClient.updateOne(query, {
    $set: {
      resetAt: new Date(),
      resetToken,
    },
  })
  if (result.matchedCount !== 1) {
    res.status(400).send({
      success: false,
      message: `Could not start password reset on account with ${ email ? 'email' : 'id' }: ${ email ? email : id }`
    })
  } else {
    res.send({
      success: true,
      resetToken,
    })
  }
}
