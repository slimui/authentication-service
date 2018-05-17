const updatePassword = require('../src/updatePassword')

describe('updatePassword', () => {
  it('should export a function', () => {
    expect(updatePassword).toBeDefined()
  })

  it('should update a password by email', async () => {
    const email = 'e@mail.com'
    const password = 'password'
    const newPassword = 'newPassword'
    const someUser = {
      verifyPassword: jest.fn(() => true),
      setPassword: jest.fn(),
      save: jest.fn(),
    }
    const AuthenticationAccountModel = {
      findOneByIdOrEmail: jest.fn(() => Promise.resolve(someUser)),
    }
    const response = await updatePassword({ AuthenticationAccountModel })({
      email,
      password,
      newPassword,
    })
    expect(AuthenticationAccountModel.findOneByIdOrEmail).toBeCalledWith({
      _id: undefined,
      email,
    })
    expect(someUser.verifyPassword).toBeCalledWith({
      password,
    })
    expect(someUser.setPassword).toBeCalledWith({
      password: newPassword,
    })
    expect(someUser.save).toBeCalled()
    expect(response).toEqual({
      success: true,
    })
  })

  it('should update a password by _id', async () => {
    const _id = 'some id'
    const password = 'password'
    const newPassword = 'newPassword'
    const someUser = {
      verifyPassword: jest.fn(() => true),
      setPassword: jest.fn(),
      save: jest.fn(),
    }
    const AuthenticationAccountModel = {
      findOneByIdOrEmail: jest.fn(() => Promise.resolve(someUser)),
    }
    const response = await updatePassword({ AuthenticationAccountModel })({
      _id,
      password,
      newPassword,
    })
    expect(AuthenticationAccountModel.findOneByIdOrEmail).toBeCalledWith({
      _id,
      email: undefined,
    })
    expect(someUser.verifyPassword).toBeCalledWith({
      password,
    })
    expect(someUser.setPassword).toBeCalledWith({
      password: newPassword,
    })
    expect(someUser.save).toBeCalled()
    expect(response).toEqual({
      success: true,
    })
  })

  it('should throw an error with missing parameters', async () => {
    expect.assertions(3)
    const email = 'e@mail.com'
    const password = 'password'
    const AuthenticationAccountModel = {}
    try {
      await updatePassword({ AuthenticationAccountModel })({})
    } catch (error) {
      expect(error.message).toBe('Please specify an _id or email')
    }
    try {
      await updatePassword({ AuthenticationAccountModel })({ email })
    } catch (error) {
      expect(error.message).toBe('Please specify a password')
    }
    try {
      await updatePassword({ AuthenticationAccountModel })({ email, password })
    } catch (error) {
      expect(error.message).toBe('Please specify a newPassword')
    }
  })

  it('should handle user who does not exist', async () => {
    const email = 'e@mail.com'
    const password = 'password'
    const newPassword = 'newPassword'
    const AuthenticationAccountModel = {
      findOneByIdOrEmail: jest.fn(() => Promise.resolve()),
    }
    try {
      await updatePassword({ AuthenticationAccountModel })({
        email,
        password,
        newPassword,
      })
    } catch (error) {
      expect(error.message).toBe(
        'Could not update account with email: e@mail.com',
      )
    }
  })
})
