const { ObjectID } = require('mongodb')
const Joi = require('joi')
const { createError } = require('@bufferapp/micro-rpc')
const { validate, parseValidationErrorMessage } = require('./utils')

const schema = Joi.object()
  .keys({
    email: Joi.string(),
    id: Joi.string(),
  })
  .xor('email', 'id')

module.exports = ({ collectionClient }) => async ({ email, id }) => {
  try {
    await validate({
      value: {
        email,
        id,
      },
      schema,
    })
  } catch (error) {
    // res.status(400).send({
    //   success: false,
    //   message: parseValidationErrorMessage({ error }),
    // })
    throw createError({
      message: parseValidationErrorMessage({ error }),
    })
  }
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
    // return res.status(400).send({
    //   success: false,
    //   message: `Could not find account with ${email ? 'email' : 'id'}: ${
    //     email ? email : id
    //   }`,
    // })
    console.log('no account...')
  } else {
    return {
      ...account,
      success: true,
      password: undefined,
      productlinks: undefined,
      resetToken: undefined,
      id: account._id,
      _id: undefined,
    }
  }
}
