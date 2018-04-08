const Joi = require('joi')
const {
  validate,
  parseValidationErrorMessage,
} = require('./utils')

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
  res.send('OK')
}
