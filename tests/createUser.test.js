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
})
