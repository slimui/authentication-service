const { ObjectID } = require('mongodb')
const getUser = require('../src/getUser')

describe('getUser', () => {
  it('should export getUser function', () => {
    expect(getUser).toBeDefined()
  })

  it('should get a user by email', async () => {
    const id = 'some user id'
    const email = 'e@mail.com'
    const account = {
      _id: id,
      email,
    }
    const collectionClient = {
      findOne: jest.fn(() => Promise.resolve(account)),
    }
    const response = await getUser({ collectionClient })({
      email,
    })
    expect(collectionClient.findOne).toBeCalledWith({
      email,
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

  it('should get a user by id', async () => {
    const id = 'some user id'
    const email = 'e@mail.com'
    const account = {
      _id: id,
      email,
    }
    const collectionClient = {
      findOne: jest.fn(() => Promise.resolve(account)),
    }
    const response = await getUser({ collectionClient })({
      id,
    })
    expect(collectionClient.findOne).toBeCalledWith({
      _id: ObjectID(id),
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
