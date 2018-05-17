const getUser = require('../src/getUser')

describe('getUser', () => {
  it('should export getUser function', () => {
    expect(getUser).toBeDefined()
  })

  it('should get a user by email', async () => {
    const _id = 'some user id'
    const email = 'e@mail.com'
    const account = {
      _id,
      email,
    }
    const AuthenticationAccountModel = {
      findOneByIdOrEmail: jest.fn(() => Promise.resolve(account)),
    }
    const response = await getUser({ AuthenticationAccountModel })({
      email,
    })
    expect(AuthenticationAccountModel.findOneByIdOrEmail).toBeCalledWith({
      _id: undefined,
      email,
      select: '_id email productlinks resetAt createdAt updatedAt lastLoginAt',
    })
    expect(response).toEqual(account)
  })

  it('should get a user by _id', async () => {
    const _id = 'some user id'
    const email = 'e@mail.com'
    const account = {
      _id,
      email,
    }
    const AuthenticationAccountModel = {
      findOneByIdOrEmail: jest.fn(() => Promise.resolve(account)),
    }
    const response = await getUser({ AuthenticationAccountModel })({
      _id,
    })
    expect(AuthenticationAccountModel.findOneByIdOrEmail).toBeCalledWith({
      _id,
      email: undefined,
      select: '_id email productlinks resetAt createdAt updatedAt lastLoginAt',
    })
    expect(response).toEqual(account)
  })

  it('should throw an error with missing parameters', async () => {
    expect.assertions(1)
    const AuthenticationAccountModel = {}
    try {
      await getUser({ AuthenticationAccountModel })({})
    } catch (error) {
      expect(error.message).toBe('_id or email must be specified')
    }
  })

  it('should throw an error when account cannot be found', async () => {
    expect.assertions(2)

    const _id = 'some user id'
    const email = 'e@mail.com'
    const AuthenticationAccountModel = {
      findOneByIdOrEmail: jest.fn(() => Promise.resolve()),
    }
    try {
      await getUser({ AuthenticationAccountModel })({
        _id,
      })
    } catch (error) {
      expect(error.message).toBe(
        'Could not find user with query: {"$or":[{"_id":"some user id"},{}]}',
      )
    }
    try {
      await getUser({ AuthenticationAccountModel })({
        email,
      })
    } catch (error) {
      expect(error.message).toBe(
        'Could not find user with query: {"$or":[{},{"email":"e@mail.com"}]}',
      )
    }
  })
})
