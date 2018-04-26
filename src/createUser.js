const { createError } = require('@bufferapp/micro-rpc')

module.exports = ({ AuthenticationAccountModel }) => async ({
  email,
  password,
}) => {
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
