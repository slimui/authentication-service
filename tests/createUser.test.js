const createUser = require('../src/createUser')

describe('createUser', () => {
  it('should export a createUser function', () => {
    expect(createUser).toBeDefined()
  })

  it('should create a new user', async () => {
    const email = 'e@mail.com'
    const password = 'password'
    const insertedId = 'someId'
    const collectionClient = {
      insertOne: jest.fn(() => Promise.resolve({ insertedId })),
    }
    const response = await createUser({ collectionClient })({
      email,
      password,
    })
    expect(response).toEqual({
      success: true,
      id: insertedId,
    })
  })

  it('should throw an error with missing parameters', async () => {
    expect.assertions(1)
    const insertedId = 'someId'
    const collectionClient = {
      insertOne: jest.fn(() => Promise.resolve({ insertedId })),
    }
    try {
      await createUser({ collectionClient })({})
    } catch (error) {
      expect(error.message).toBe('"email" is required,"password" is required')
    }
  })

  it('should handle error during insertOne', async () => {
    expect.assertions(1)
    const email = 'e@mail.com'
    const password = 'password'
    const errorMessage = 'this is broken'
    const collectionClient = {
      insertOne: jest.fn(() => Promise.reject(new Error(errorMessage))),
    }
    try {
      await createUser({ collectionClient })({
        email,
        password,
      })
    } catch (error) {
      expect(error.message).toBe(errorMessage)
    }
  })
})
