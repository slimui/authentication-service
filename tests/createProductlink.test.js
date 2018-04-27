const createProductlink = require('../src/createProductlink')

describe('createProductlink', () => {
  it('should export a function', () => {
    expect(createProductlink).toBeDefined()
  })

  it('should create a product link by id', async () => {
    const _id = 'some user id'
    const productName = 'some product name'
    const foreignKey = 'some foreign key'
    const AuthenticationAccountModel = {
      updateOne: jest.fn(() =>
        Promise.resolve({
          ok: 1,
        }),
      ),
    }
    const response = await createProductlink({ AuthenticationAccountModel })({
      _id,
      productName,
      foreignKey,
    })
    expect(response).toEqual({
      success: true,
    })
    expect(AuthenticationAccountModel.updateOne).toBeCalledWith(
      { $or: [{ _id }, { email: undefined }] },
      {
        $addToSet: {
          productlinks: {
            foreignKey,
            productName,
          },
        },
      },
      { runValidators: true },
    )
  })

  it('should create a product link by email', async () => {
    const email = 'e@mail.com'
    const productName = 'some product name'
    const foreignKey = 'some foreign key'
    const AuthenticationAccountModel = {
      updateOne: jest.fn(() =>
        Promise.resolve({
          ok: 1,
        }),
      ),
    }
    const response = await createProductlink({ AuthenticationAccountModel })({
      email,
      productName,
      foreignKey,
    })
    expect(response).toEqual({
      success: true,
    })
    expect(AuthenticationAccountModel.updateOne).toBeCalledWith(
      { $or: [{ _id: undefined }, { email }] },
      {
        $addToSet: {
          productlinks: {
            foreignKey,
            productName,
          },
        },
      },
      { runValidators: true },
    )
  })

  it('should throw an error with missing parameters', async () => {
    expect.assertions(3)
    const email = 'e@mail.com'
    const productName = 'some product name'
    const AuthenticationAccountModel = {
      updateOne: jest.fn(() => Promise.resolve()),
    }
    try {
      await createProductlink({ AuthenticationAccountModel })({})
    } catch (error) {
      expect(error.message).toBe('Please specify an _id or email')
    }
    try {
      await createProductlink({ AuthenticationAccountModel })({ email })
    } catch (error) {
      expect(error.message).toBe('Please specify a productName')
    }
    try {
      await createProductlink({ AuthenticationAccountModel })({
        email,
        productName,
      })
    } catch (error) {
      expect(error.message).toBe('Please specify a foreignKey')
    }
  })
})
