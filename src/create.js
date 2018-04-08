const Joi = require('joi')
const {
  validate,
  parseValidationErrorMessage,
} = require('./utils')

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
  console.log('collectionClient.findOne()', await collectionClient.findOne());

  res.send('ok')
}
