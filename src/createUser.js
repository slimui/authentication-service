const { createError } = require('@bufferapp/micro-rpc')

module.exports = ({ AuthenticationAccountModel }) => async ({
  email,
  password,
}) => {
  if (!email) {
    throw createError({
      message: 'email is a required parameter',
    })
  }
  if (!password) {
    throw createError({
      message: 'password is a required parameter',
    })
  }
  try {
    const authenticationAccount = new AuthenticationAccountModel({
      email,
      password,
    })
    const { _id } = await authenticationAccount.save()
    return { _id }
  } catch (error) {
    throw createError({
      message: error.message,
    })
  }
}
