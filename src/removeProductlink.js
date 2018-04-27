const { createError } = require('@bufferapp/micro-rpc')

module.exports = ({ AuthenticationAccountModel }) => async ({
  email,
  _id,
  productName,
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
  const result = await AuthenticationAccountModel.updateOne(
    { $or: [{ _id }, { email }] },
    {
      $pull: {
        productlinks: {
          productName,
        },
      },
    },
  )
  if (result.ok !== 1) {
    throw createError({
      message: `Could not update ${JSON.stringify({
        $or: [{ _id }, { email }],
      })}`,
    })
  } else {
    return {
      success: true,
    }
  }
}
