const createUser = require('../src/createUser')

describe('createUser', () => {
  it('should export a createUser function', () => {
    expect(createUser).toBeDefined()
  })

  it('should create a new user', async () => {
    const email = 'e@mail.com'
    const password = 'password'
    const _id = 'someId'
    const someUser = {
      setPassword: jest.fn(),
      save: jest.fn(() => Promise.resolve({ _id })),
    }
    const AuthenticationAccountModel = function() {
      return someUser
    }
    const response = await createUser({ AuthenticationAccountModel })({
      email,
      password,
    })
    expect(someUser.setPassword).toBeCalledWith({
      password,
    })
    expect(response).toEqual({
      _id,
    })
  })

  it('should throw an error with missing email', async () => {
    expect.assertions(1)
    const AuthenticationAccountModel = function() {
      return {
        save: jest.fn(() => Promise.resolve({ _id: '100' })),
      }
    }
    try {
      await createUser({ AuthenticationAccountModel })({})
    } catch (error) {
      expect(error.message).toBe('email is a required parameter')
    }
  })

  it('should throw an error with missing password', async () => {
    expect.assertions(1)
    const email = 'e@mail.com'
    const AuthenticationAccountModel = function() {
      return {
        save: jest.fn(() => Promise.resolve({ _id: '100' })),
      }
    }
    try {
      await createUser({ AuthenticationAccountModel })({ email })
    } catch (error) {
      expect(error.message).toBe('password is a required parameter')
    }
  })

  it('should handle error during insertOne', async () => {
    expect.assertions(1)
    const email = 'e@mail.com'
    const password = 'password'
    const errorMessage = 'this is broken'
    const AuthenticationAccountModel = function() {
      return {
        save: jest.fn(() => Promise.reject(new Error(errorMessage))),
        setPassword: jest.fn(),
      }
    }
    try {
      await createUser({ AuthenticationAccountModel })({
        email,
        password,
      })
    } catch (error) {
      expect(error.message).toBe(errorMessage)
    }
  })
})
