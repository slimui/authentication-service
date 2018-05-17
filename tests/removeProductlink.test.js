const removeProductlink = require('../src/removeProductlink')

describe('removeProductlink', () => {
  it('should export function', () => {
    expect(removeProductlink).toBeDefined()
  })

  it('should remove a productlink by _id', async () => {
    const _id = 'some user id'
    const productName = 'some product name'
    const AuthenticationAccountModel = {
      removeProductlink: jest.fn(() =>
        Promise.resolve({
          result: {
            ok: 1,
            n: 1,
          },
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
    expect(AuthenticationAccountModel.removeProductlink).toBeCalledWith({
      _id,
      email: undefined,
      productName,
    })
  })

  it('should remove a productlink by email', async () => {
    const email = 'e@mail.com'
    const productName = 'some product name'
    const AuthenticationAccountModel = {
      removeProductlink: jest.fn(() =>
        Promise.resolve({
          result: {
            ok: 1,
            n: 1,
          },
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
    expect(AuthenticationAccountModel.removeProductlink).toBeCalledWith({
      _id: undefined,
      email,
      productName,
    })
  })

  it('should throw an error with missing parameters', async () => {
    expect.assertions(2)
    const email = 'e@mail.com'
    const AuthenticationAccountModel = {
      updateOne: jest.fn(() => Promise.resolve()),
    }
    try {
      await removeProductlink({ AuthenticationAccountModel })({})
    } catch (error) {
      expect(error.message).toBe('Please specify an _id or email')
    }
    try {
      await removeProductlink({ AuthenticationAccountModel })({ email })
    } catch (error) {
      expect(error.message).toBe('Please specify a productName')
    }
  })

  it('should handle a not ok error from mongodb', async () => {
    expect.assertions(1)
    const _id = 'some user id'
    const productName = 'some product name'
    const AuthenticationAccountModel = {
      removeProductlink: jest.fn(() =>
        Promise.resolve({
          result: {
            ok: 0,
            n: 1,
          },
        }),
      ),
    }
    try {
      await removeProductlink({ AuthenticationAccountModel })({
        _id,
        productName,
      })
    } catch (error) {
      expect(error.message).toBe(
        'Could not remove product link from {"$or":[{"_id":"some user id"},{}]}',
      )
    }
  })
})
