const { createError } = require('@bufferapp/micro-rpc')

module.exports = ({ AuthenticationAccountModel }) => async ({
  _id,
  email,
  password,
  newPassword,
}) => {
  if (!_id && !email) {
    throw createError({
      message: 'Please specify an _id or email',
    })
  }
  if (!password) {
    throw createError({
      message: 'Please specify a password',
    })
  }
  if (!newPassword) {
    throw createError({
      message: 'Please specify a newPassword',
    })
  }
  if (password === newPassword) {
    throw createError({
      message: 'password and newPassword cannot match',
    })
  }
  const user = await AuthenticationAccountModel.findOne({
    $or: [{ _id }, { email }],
  }).exec()
  if (!user) {
    // intentionally generic error
    throw createError({
      message: `Could not update account with ${email ? 'email' : '_id'}: ${
        email ? email : _id
      }`,
    })
  }
  if (!(await user.verifyPassword({ password }))) {
    // intentionally generic error
    throw createError({
      message: `Could not update account with ${email ? 'email' : '_id'}: ${
        email ? email : _id
      }`,
    })
  }
  await user.setPassword({
    password: newPassword,
  })
  await user.save()
  return {
    success: true,
  }
}
