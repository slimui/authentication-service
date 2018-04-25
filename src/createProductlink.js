const { ObjectID } = require('mongodb')
const Joi = require('joi')
const { createError } = require('@bufferapp/micro-rpc')
const { validate, parseValidationErrorMessage } = require('./utils')

const schema = Joi.object()
  .keys({
    email: Joi.string(),
    id: Joi.string(),
    productName: Joi.string().required(),
    foreignKey: Joi.string().required(),
  })
  .xor('email', 'id')

module.exports = ({ collectionClient }) => async ({
  email,
  id,
  productName,
  foreignKey,
}) => {
  try {
    await validate({
      value: {
        email,
        id,
        productName,
        foreignKey,
      },
      schema,
    })
  } catch (error) {
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
  const result = await collectionClient.updateOne(query, {
    $set: {
      [`productlinks.${productName}`]: {
        foreignKey,
      },
    },
  })
  if (result.matchedCount !== 1) {
    console.log('error', error)
    // res.status(400).send({
    //   success: false,
    //   message: `Could not update account with ${email ? 'email' : 'id'}: ${
    //     email ? email : id
    //   }`,
    // })
  } else {
    return {
      success: true,
    }
    // res.send({
    //   success: true,
    // })
  }
}
