const { createError } = require('@bufferapp/micro-rpc')

module.exports = ({ AuthenticationAccountModel }) => async ({
  email,
  _id,
  productName,
  foreignKey,
}) => {
  if (!_id && !email) {
    throw createError({
      message: 'Please specify an _id or email',
    })
  }
  if (!productName) {
    throw createError({
      message: 'Please specify a productName',
    })
  }
  if (!foreignKey) {
    throw createError({
      message: 'Please specify a foreignKey',
    })
  }
  try {
    const result = await AuthenticationAccountModel.updateOne(
      { $or: [{ _id }, { email }] },
      {
        $addToSet: {
          productlinks: {
            productName,
            foreignKey,
          },
        },
      },
      { runValidators: true },
    )
    if (result.ok !== 1) {
      throw createError({
        message: `Could not update ${JSON.stringify(query)}`,
      })
    }
    return {
      success: true,
    }
  } catch (error) {
    throw createError({
      message: error.message,
    })
  }
}
