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
    email: Joi.string().required(),
    password: Joi.string().required(),
    data: Joi.object(),
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
  const { email, password, data = {}} = req.body;
  try {
    const { insertedId } = await collectionClient.insertOne({
      email,
      password: await hash(password, 10),
      productlinks: {},
      resetToken: null,
      resetAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: null,
      data,
    })
    res.send({
      success: true,
      id: insertedId,
    })
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    })
  }
}
