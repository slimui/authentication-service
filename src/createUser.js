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
    const { _id: id } = await authenticationAccount.save()
    return { id }
  } catch (error) {
    throw createError({
      message: error.message,
    })
  }
}
