const getUser = require('../src/getUser')

describe('getUser', () => {
  it('should export getUser function', () => {
    expect(getUser).toBeDefined()
  })

  it('should get a user by email', async () => {
    const id = 'some user id'
    const account = {
      _id: id,
      email: 'e@mail.com',
    }
    const collectionClient = {
      findOne: jest.fn(() => Promise.resolve(account)),
    }
    const response = await getUser({ collectionClient })({
      id,
    })
    expect(response).toEqual({
      success: true,
      ...account,
      password: undefined,
      productlinks: undefined,
      resetToken: undefined,
      _id: undefined,
      id,
    })
  })
})
