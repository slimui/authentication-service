const { createError } = require('@bufferapp/micro-rpc')

module.exports = ({ AuthenticationAccountModel }) => async ({ email, _id }) => {
  if (!_id && !email) {
    throw createError({
      message: '_id or email must be specified',
    })
  }
  const result = await AuthenticationAccountModel.findOneByIdOrEmail({
    _id,
    email,
  })
  if (!result) {
    throw createError({
      message: `Could not find user with query: ${JSON.stringify({
        $or: [{ _id }, { email }],
      })}`,
    })
  }
  return result
}
