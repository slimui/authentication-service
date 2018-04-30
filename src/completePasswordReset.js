const { createError } = require('@bufferapp/micro-rpc')

module.exports = ({ AuthenticationAccountModel }) => async ({
  _id,
  email,
  resetToken,
  password,
}) => {
  if (!_id && !email) {
    throw createError({
      message: '_id or email must be specified',
    })
  }
  if (!resetToken) {
    throw createError({
      message: 'resetToken is a required parameter',
    })
  }
  if (!password) {
    throw createError({
      message: 'password is a required parameter',
    })
  }
  const user = await AuthenticationAccountModel.findOne({
    $or: [{ _id }, { email }],
  }).exec()
  if (!user || !(await user.verifyResetToken({ resetToken }))) {
    // intentionally generic error
    throw createError({
      message: `Could not update account with ${email ? 'email' : '_id'}: ${
        email ? email : _id
      }`,
    })
  }
  user.password = password
  user.resetToken = null
  await user.save()
  return {
    success: true,
  }
}