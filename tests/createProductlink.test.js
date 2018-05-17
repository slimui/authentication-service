const createProductlink = require('../src/createProductlink')

describe('createProductlink', () => {
  it('should export a function', () => {
    expect(createProductlink).toBeDefined()
  })

  it('should create a product link by id', async () => {
    const _id = 'some user id'
    const productName = 'reply'
    const foreignKey = 'some foreign key'
    const AuthenticationAccountModel = {
      updateOne: jest.fn(() =>
        Promise.resolve({
          n: 1,
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
    const productName = 'reply'
    const foreignKey = 'some foreign key'
    const AuthenticationAccountModel = {
      updateOne: jest.fn(() =>
        Promise.resolve({
          n: 1,
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
    const productName = 'reply'
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
      expect(error.message).toBe(
        'Please specify a valid productName "publish" "reply" or "analyze"',
      )
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

  it('should handle a not ok error from mongodb', async () => {
    expect.assertions(1)
    const _id = 'some user id'
    const productName = 'reply'
    const foreignKey = 'some foreign key'
    const AuthenticationAccountModel = {
      updateOne: jest.fn(() =>
        Promise.resolve({
          n: 1,
          ok: 0,
        }),
      ),
    }
    try {
      await createProductlink({ AuthenticationAccountModel })({
        _id,
        productName,
        foreignKey,
      })
    } catch (error) {
      expect(error.message).toBe(
        'Could not create product link for {"$or":[{"_id":"some user id"},{}]}',
      )
    }
  })

  it('should handle a not finding user from mongodb', async () => {
    expect.assertions(1)
    const _id = 'some user id'
    const productName = 'reply'
    const foreignKey = 'some foreign key'
    const AuthenticationAccountModel = {
      updateOne: jest.fn(() =>
        Promise.resolve({
          n: 0,
          ok: 1,
        }),
      ),
    }
    try {
      await createProductlink({ AuthenticationAccountModel })({
        _id,
        productName,
        foreignKey,
      })
    } catch (error) {
      expect(error.message).toBe(
        'Could not create product link for {"$or":[{"_id":"some user id"},{}]}',
      )
    }
  })

  it('should only allow "publish" "reply" "analyze" product links', async () => {
    expect.assertions(1)
    const _id = 'some user id'
    const foreignKey = 'some foreign key'
    const AuthenticationAccountModel = {
      updateOne: jest.fn(() =>
        Promise.resolve({
          n: 1,
          ok: 1,
        }),
      ),
    }
    await createProductlink({ AuthenticationAccountModel })({
      _id,
      productName: 'publish',
      foreignKey,
    })
    await createProductlink({ AuthenticationAccountModel })({
      _id,
      productName: 'reply',
      foreignKey,
    })
    await createProductlink({ AuthenticationAccountModel })({
      _id,
      productName: 'analyze',
      foreignKey,
    })
    try {
      await createProductlink({ AuthenticationAccountModel })({
        _id,
        productName: 'nope',
        foreignKey,
      })
    } catch (error) {
      expect(error.message).toBe(
        'Please specify a valid productName "publish" "reply" or "analyze"',
      )
    }
  })
})
