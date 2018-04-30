const { createError } = require('@bufferapp/micro-rpc')

const throwFailedResponse = ({ _id, email }) => {
  throw createError({
    message: `Could not update account with ${email ? 'email' : '_id'}: ${
      email ? email : _id
    }`,
  })
}

module.exports = ({ AuthenticationAccountModel }) => async ({
  _id,
  email,
  password,
  newPassword,
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
  if (!newPassword) {
    throw createError({
      message: 'newPassword is a required parameter',
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
  // set the raw password -- it gets hashed in the pre-save hook
  user.password = newPassword
  await user.save()
  return {
    success: true,
  }
}
