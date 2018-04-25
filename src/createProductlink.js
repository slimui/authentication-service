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
    productName: Joi.string().required(),
    foreignKey: Joi.string().required(),
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
  const { email, id, productName, foreignKey } = req.body
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
    res.status(400).send({
      success: false,
      message: `Could not update account with ${ email ? 'email' : 'id' }: ${ email ? email : id }`
    })
  } else {
    res.send({
      success: true,
    })
  }
}
