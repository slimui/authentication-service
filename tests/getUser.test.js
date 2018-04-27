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
      findOne: jest.fn(() => ({
        select: () => ({
          exec: () => Promise.resolve(account),
        }),
      })),
    }
    const response = await getUser({ AuthenticationAccountModel })({
      email,
    })
    expect(AuthenticationAccountModel.findOne).toBeCalledWith({
      $or: [{ _id: undefined }, { email }],
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
      findOne: jest.fn(() => ({
        select: () => ({
          exec: () => Promise.resolve(account),
        }),
      })),
    }
    const response = await getUser({ AuthenticationAccountModel })({
      _id,
    })
    expect(AuthenticationAccountModel.findOne).toBeCalledWith({
      $or: [{ _id }, { email: undefined }],
    })
    expect(response).toEqual(account)
  })

  it('should throw an error with missing parameters', async () => {
    expect.assertions(1)
    const collectionClient = {
      findOne: jest.fn(() => Promise.resolve()),
    }
    try {
      await getUser({ collectionClient })({})
    } catch (error) {
      expect(error.message).toBe(
        '"value" must contain at least one of [email, id]',
      )
    }
  })

  it('should throw an error when account cannot be found', async () => {
    expect.assertions(2)

    const id = 'some user id'
    const email = 'e@mail.com'
    const collectionClient = {
      findOne: jest.fn(() => Promise.resolve()),
    }
    try {
      await getUser({ collectionClient })({
        id,
      })
    } catch (error) {
      expect(error.message).toBe(`Could not find account with id: ${id}`)
    }
    try {
      await getUser({ collectionClient })({
        email,
      })
    } catch (error) {
      expect(error.message).toBe(`Could not find account with email: ${email}`)
    }
  })
})
