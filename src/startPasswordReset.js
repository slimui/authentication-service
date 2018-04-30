const uuid = require('uuid/v4')
const { createError } = require('@bufferapp/micro-rpc')

module.exports = ({ AuthenticationAccountModel }) => async ({ _id, email }) => {
  if (!_id && !email) {
    throw createError({
      message: 'Please specify an _id or email',
    })
  }
  const resetToken = uuid()
  const result = await AuthenticationAccountModel.updateOne(
    { $or: [{ _id }, { email }] },
    {
      $set: {
        resetAt: new Date(),
        resetToken,
      },
    },
    { runValidators: true },
  )
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
