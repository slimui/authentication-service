const { createError } = require('@bufferapp/micro-rpc')

module.exports = ({ AuthenticationAccountModel }) => async ({ _id, email }) => {
  if (!_id && !email) {
    throw createError({
      message: '_id or email must be specified',
    })
  }
  const {
    result,
    resetToken,
  } = await AuthenticationAccountModel.generateResetToken({
    _id,
    email,
  })
  if (result.n !== 1 || result.ok !== 1) {
    throw createError({
      message: `Could not start password reset on account with ${JSON.stringify(
        {
          $or: [{ _id }, { email }],
        },
      )}`,
    })
  } else {
    return {
      resetToken,
    }
  }
}
