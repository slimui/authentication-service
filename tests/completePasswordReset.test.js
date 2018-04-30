const completePasswordReset = require('../src/completePasswordReset')

describe('completePasswordReset', () => {
  it('should export a function', () => {
    expect(completePasswordReset).toBeDefined()
  })

  it('should complete a password reset by email', async () => {
    const email = 'e@mail.com'
    const resetToken = 'some reset token'
    const password = 'some password'
    const someUser = {
      verifyResetToken: jest.fn(() => true),
      save: jest.fn(),
    }
    const AuthenticationAccountModel = {
      findOne: jest.fn(() => ({
        exec: () => Promise.resolve(someUser),
      })),
    }
    const response = await completePasswordReset({
      AuthenticationAccountModel,
    })({
      email,
      resetToken,
      password,
    })
    expect(AuthenticationAccountModel.findOne).toBeCalledWith({
      $or: [{ _id: undefined }, { email }],
    })
    expect(someUser.verifyResetToken).toBeCalledWith({
      resetToken,
    })
    expect(someUser.password).toBe(password)
    expect(someUser.resetToken).toBe(null)
    expect(someUser.save).toBeCalled()
    expect(response).toEqual({
      success: true,
    })
  })
  it('should complete a password reset by _id', async () => {
    const _id = 'some id'
    const resetToken = 'some reset token'
    const password = 'some password'
    const someUser = {
      verifyResetToken: jest.fn(() => true),
      save: jest.fn(),
    }
    const AuthenticationAccountModel = {
      findOne: jest.fn(() => ({
        exec: () => Promise.resolve(someUser),
      })),
    }
    const response = await completePasswordReset({
      AuthenticationAccountModel,
    })({
      _id,
      resetToken,
      password,
    })
    expect(AuthenticationAccountModel.findOne).toBeCalledWith({
      $or: [{ _id }, { email: undefined }],
    })
    expect(someUser.verifyResetToken).toBeCalledWith({
      resetToken,
    })
    expect(someUser.password).toBe(password)
    expect(someUser.resetToken).toBe(null)
    expect(someUser.save).toBeCalled()
    expect(response).toEqual({
      success: true,
    })
  })
})
