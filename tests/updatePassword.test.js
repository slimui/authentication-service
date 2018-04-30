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
      save: jest.fn(),
    }
    const AuthenticationAccountModel = {
      findOne: jest.fn(() => ({
        exec: () => Promise.resolve(someUser),
      })),
    }
    const response = await updatePassword({ AuthenticationAccountModel })({
      email,
      password,
      newPassword,
    })
    expect(AuthenticationAccountModel.findOne).toBeCalledWith({
      $or: [{ _id: undefined }, { email }],
    })
    expect(someUser.verifyPassword).toBeCalledWith({
      password,
    })
    expect(someUser.password).toBe(newPassword)
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
      save: jest.fn(),
    }
    const AuthenticationAccountModel = {
      findOne: jest.fn(() => ({
        exec: () => Promise.resolve(someUser),
      })),
    }
    const response = await updatePassword({ AuthenticationAccountModel })({
      _id,
      password,
      newPassword,
    })
    expect(AuthenticationAccountModel.findOne).toBeCalledWith({
      $or: [{ _id }, { email: undefined }],
    })
    expect(someUser.verifyPassword).toBeCalledWith({
      password,
    })
    expect(someUser.password).toBe(newPassword)
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
      expect(error.message).toBe('_id or email must be specified')
    }
    try {
      await updatePassword({ AuthenticationAccountModel })({ email })
    } catch (error) {
      expect(error.message).toBe('password is a required parameter')
    }
    try {
      await updatePassword({ AuthenticationAccountModel })({ email, password })
    } catch (error) {
      expect(error.message).toBe('newPassword is a required parameter')
    }
  })

  it('should handle user who does not exist', async () => {
    const email = 'e@mail.com'
    const password = 'password'
    const newPassword = 'newPassword'
    const AuthenticationAccountModel = {
      findOne: jest.fn(() => ({
        exec: () => Promise.resolve(),
      })),
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
