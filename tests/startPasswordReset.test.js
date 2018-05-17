const startPasswordReset = require('../src/startPasswordReset')
let someDate = new Date()

describe('startPasswordReset', () => {
  beforeEach(() => {
    global.Date = jest.fn(() => someDate)
  })

  afterEach(() => {
    global.Date.mockRestore()
  })
  it('should export a function', () => {
    expect(startPasswordReset).toBeDefined()
  })

  it('should start password reset by email', async () => {
    const email = 'e@mail.com'
    const uniqueId = 'some uniqueId'
    const AuthenticationAccountModel = {
      generateResetToken: jest.fn(() =>
        Promise.resolve({
          result: {
            n: 1,
            ok: 1,
          },
          resetToken: uniqueId,
        }),
      ),
    }
    const response = await startPasswordReset({ AuthenticationAccountModel })({
      email,
    })
    expect(AuthenticationAccountModel.generateResetToken).toBeCalledWith({
      _id: undefined,
      email,
    })
    expect(response).toEqual({
      resetToken: uniqueId,
    })
  })

  it('should start password reset by _id', async () => {
    const _id = 'some id'
    const uniqueId = 'some uniqueId'
    const AuthenticationAccountModel = {
      generateResetToken: jest.fn(() =>
        Promise.resolve({
          result: {
            n: 1,
            ok: 1,
          },
          resetToken: uniqueId,
        }),
      ),
    }
    const response = await startPasswordReset({ AuthenticationAccountModel })({
      _id,
    })
    expect(AuthenticationAccountModel.generateResetToken).toBeCalledWith({
      _id,
      email: undefined,
    })
    expect(response).toEqual({
      resetToken: uniqueId,
    })
  })

  it('should throw an error with missing parameters', async () => {
    expect.assertions(1)
    const AuthenticationAccountModel = {}
    try {
      await startPasswordReset({ AuthenticationAccountModel })({})
    } catch (error) {
      expect(error.message).toBe('_id or email must be specified')
    }
  })

  it('should handle user who does not exist', async () => {
    const email = 'e@mail.com'
    const AuthenticationAccountModel = {
      generateResetToken: jest.fn(() =>
        Promise.resolve({
          result: {
            n: 0,
            ok: 1,
          },
        }),
      ),
    }
    try {
      await startPasswordReset({ AuthenticationAccountModel })({
        email,
      })
    } catch (error) {
      expect(error.message).toBe(
        'Could not start password reset on account with {"$or":[{},{"email":"e@mail.com"}]}',
      )
    }
  })

  it('should handle not OK result', async () => {
    const email = 'e@mail.com'

    const AuthenticationAccountModel = {
      generateResetToken: jest.fn(() =>
        Promise.resolve({
          result: {
            n: 1,
            ok: 0,
          },
        }),
      ),
    }
    try {
      await startPasswordReset({ AuthenticationAccountModel })({
        email,
      })
    } catch (error) {
      expect(error.message).toBe(
        'Could not start password reset on account with {"$or":[{},{"email":"e@mail.com"}]}',
      )
    }
  })
})
