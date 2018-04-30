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
})
