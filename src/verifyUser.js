const { createError } = require('@bufferapp/micro-rpc')

module.exports = ({ AuthenticationAccountModel }) => async ({
  _id,
  email,
  password,
  productName,
}) => {
  if (!_id && !email) {
    throw createError({
      message: '_id or email must be specified',
    })
  }
  if (!password) {
    throw createError({
      message: 'password is a required parameter',
    })
  }
  if (!productName) {
    throw createError({
      message: 'productName is a required parameter',
    })
  }
  const user = await AuthenticationAccountModel.findOne({
    $or: [{ _id }, { email }],
  }).exec()
  if (
    !user ||
    !(await user.verifyPassword({ password })) ||
    !(await user.verifyProductname({ productName }))
  ) {
    // intentionally generic error
    throw createError({
      message: 'Could authenticate with credentials',
    })
  }
  return {
    foreignKey: user.productlinks.find(link => link.productName === productName)
      .foreignKey,
  }
}