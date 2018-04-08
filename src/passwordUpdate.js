const { promisify } = require('util')
const { ObjectID } = require('mongodb')
const bcrypt = require('bcryptjs')
const Joi = require('joi')
const {
  validate,
  parseValidationErrorMessage,
} = require('./utils')
const compare = promisify(bcrypt.compare)
const hash = promisify(bcrypt.hash)

const schema = Joi.object()
  .keys({
    email: Joi.string(),
    id: Joi.string(),
    password: Joi.string().required(),
    newPassword: Joi.string().required(),
  })
    .xor('email', 'id')

const sendFailedResponse = ({ res, id, email }) => res.status(400).send({
  success: false,
  message: `Could not update account with ${ email ? 'email' : 'id' }: ${ email ? email : id }`
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
  // TODO: validate password
  const { id, email, password, newPassword } = req.body
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
    // could not find account
    sendFailedResponse({ res, id, email })
  } else {
    if (!await compare(password, account.password)) {
      // password mismatch
      sendFailedResponse({ res, id, email })
    } else {
      const result = await collectionClient.updateOne(query, {
        $set: {
          password: await hash(newPassword, 10)
        }
      })
      if (result.matchedCount !== 1) {
        // no account was updated
        sendFailedResponse({ res, id, email })
      } else {
        res.send({
          success: true,
        })
      }
    }
  }
}
