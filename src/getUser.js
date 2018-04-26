const { createError } = require('@bufferapp/micro-rpc')

module.exports = ({ AuthenticationAccountModel }) => async ({ email, _id }) => {
  if (!_id && !email) {
    throw createError({
      message: 'Please specify an _id or email',
    })
  }
  let query
  if (_id) {
    query = { _id }
  } else {
    query = { email }
  }
  const result = await AuthenticationAccountModel.findOne(query)
    .select('_id email productlinks resetAt createdAt updatedAt lastLoginAt')
    .exec()
  if (!result) {
    throw createError({
      message: `Could not find user with ${JSON.stringify(query)}`,
    })
  }
  return result
}
