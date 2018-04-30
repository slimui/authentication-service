const verifyUser = require('../src/verifyUser')

describe('verifyUser', () => {
  it('should export a function', () => {
    expect(verifyUser).toBeDefined()
  })
  it('should verify a user by email', async () => {
    const email = 'e@mail.com'
    const password = 'some password'
    const productName = 'some product name'
    const foreignKey = 'foreignKey'
    const someUser = {
      verifyPassword: jest.fn(() => true),
      verifyProductname: jest.fn(() => true),
      productlinks: [
        {
          productName,
          foreignKey,
        },
      ],
    }
    const AuthenticationAccountModel = {
      findOne: jest.fn(() => ({
        exec: () => Promise.resolve(someUser),
      })),
    }
    const response = await verifyUser({
      AuthenticationAccountModel,
    })({
      email,
      password,
      productName,
    })
    expect(AuthenticationAccountModel.findOne).toBeCalledWith({
      $or: [{ _id: undefined }, { email }],
    })
    expect(someUser.verifyPassword).toBeCalledWith({
      password,
    })
    expect(someUser.verifyProductname).toBeCalledWith({
      productName,
    })
    expect(response).toEqual({
      foreignKey,
    })
  })
  it('should verify a user by _id', async () => {
    const _id = 'some user id'
    const password = 'some password'
    const productName = 'some product name'
    const foreignKey = 'foreignKey'
    const someUser = {
      verifyPassword: jest.fn(() => true),
      verifyProductname: jest.fn(() => true),
      productlinks: [
        {
          productName,
          foreignKey,
        },
      ],
    }
    const AuthenticationAccountModel = {
      findOne: jest.fn(() => ({
        exec: () => Promise.resolve(someUser),
      })),
    }
    const response = await verifyUser({
      AuthenticationAccountModel,
    })({
      _id,
      password,
      productName,
    })
    expect(AuthenticationAccountModel.findOne).toBeCalledWith({
      $or: [{ _id }, { email: undefined }],
    })
    expect(someUser.verifyPassword).toBeCalledWith({
      password,
    })
    expect(someUser.verifyProductname).toBeCalledWith({
      productName,
    })
    expect(response).toEqual({
      foreignKey,
    })
  })

  it('should throw an error with missing parameters', async () => {
    expect.assertions(3)
    const email = 'e@mail.com'
    const password = 'password'
    const AuthenticationAccountModel = {}
    try {
      await verifyUser({ AuthenticationAccountModel })({})
    } catch (error) {
      expect(error.message).toBe('_id or email must be specified')
    }
    try {
      await verifyUser({ AuthenticationAccountModel })({ email })
    } catch (error) {
      expect(error.message).toBe('password is a required parameter')
    }
    try {
      await verifyUser({ AuthenticationAccountModel })({
        email,
        password,
      })
    } catch (error) {
      expect(error.message).toBe('productName is a required parameter')
    }
  })
})
