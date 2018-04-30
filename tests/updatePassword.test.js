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
})
