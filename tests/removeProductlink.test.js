const removeProductlink = require('../src/removeProductlink')

describe('removeProductlink', () => {
  it('should export function', () => {
    expect(removeProductlink).toBeDefined()
  })

  it('should remove a productlink', async () => {
    const _id = 'some user id'
    const productName = 'some product name'
    const AuthenticationAccountModel = {
      updateOne: jest.fn(() =>
        Promise.resolve({
          ok: 1,
        }),
      ),
    }
    const response = await removeProductlink({ AuthenticationAccountModel })({
      _id,
      productName,
    })
    expect(response).toEqual({
      success: true,
    })
    expect(AuthenticationAccountModel.updateOne).toBeCalledWith(
      { $or: [{ _id }, { email: undefined }] },
      {
        $pull: {
          productlinks: {
            productName,
          },
        },
      },
    )
  })
})
