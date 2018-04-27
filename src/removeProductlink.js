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
    console.log('nope')
    // res.status(400).send({
    //   success: false,
    //   message: `Could not update account with ${email ? 'email' : 'id'}: ${
    //     email ? email : id
    //   }`,
    // })
  } else {
    return {
      success: true,
    }
  }
}
