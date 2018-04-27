const removeProductlink = require('../src/removeProductlink')

describe('removeProductlink', () => {
  it('should export function', () => {
    expect(removeProductlink).toBeDefined()
  })

  it('should remove a productlink by _id', async () => {
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

  it('should remove a productlink by email', async () => {
    const email = 'e@mail.com'
    const productName = 'some product name'
    const AuthenticationAccountModel = {
      updateOne: jest.fn(() =>
        Promise.resolve({
          ok: 1,
        }),
      ),
    }
    const response = await removeProductlink({ AuthenticationAccountModel })({
      email,
      productName,
    })
    expect(response).toEqual({
      success: true,
    })
    expect(AuthenticationAccountModel.updateOne).toBeCalledWith(
      { $or: [{ _id: undefined }, { email }] },
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
