const { promisify } = require('util')
const { ObjectID } = require('mongodb')
const bcrypt = require('bcryptjs')
const uuid = require('uuid/v4')
const Joi = require('joi')
const {
  validate,
  parseValidationErrorMessage,
} = require('./utils')
const hash = promisify(bcrypt.hash)

const schema = Joi.object()
  .keys({
    email: Joi.string(),
    id: Joi.string(),
    resetToken: Joi.string().required(),
    password: Joi.string().required(),
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
  const { email, id, resetToken, password } = req.body
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
    const now = new Date().getTime()
    const expireTime = account.resetAt.getTime() + process.env.RESET_TIMEOUT * 1000
    if (resetToken !== account.resetToken || expireTime < now) {
      // password mismatch
      sendFailedResponse({ res, id, email })
    } else {
      const result = await collectionClient.updateOne(query, {
        $set: {
          password: await hash(password, 10),
          resetToken: null,
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
