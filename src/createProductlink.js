const { createError } = require('@bufferapp/micro-rpc')

module.exports = ({ AuthenticationAccountModel }) => async ({
  email,
  _id,
  productName,
  foreignKey,
}) => {
  if (!_id && !email) {
    throw createError({
      message: 'Please specify an _id or email',
    })
  }
  if (!productName || !['publish', 'reply', 'analyze'].includes(productName)) {
    throw createError({
      message:
        'Please specify a valid productName "publish" "reply" or "analyze"',
    })
  }
  if (!foreignKey) {
    throw createError({
      message: 'Please specify a foreignKey',
    })
  }
  try {
    const { result } = await AuthenticationAccountModel.createProductlink({
      _id,
      email,
      foreignKey,
      productName,
    })
    if (result.n !== 1 || result.ok !== 1) {
      throw createError({
        message: `Could not create product link for ${JSON.stringify({
          $or: [{ _id }, { email }],
        })}`,
      })
    }
    return {
      success: true,
    }
  } catch (error) {
    throw createError({
      message: error.message,
    })
  }
}
