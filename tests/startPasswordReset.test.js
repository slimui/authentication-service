const uuid = require('uuid/v4')
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
    const AuthenticationAccountModel = {
      updateOne: jest.fn(() =>
        Promise.resolve({
          n: 1,
          ok: 1,
        }),
      ),
    }
    const response = await startPasswordReset({ AuthenticationAccountModel })({
      email,
    })
    expect(AuthenticationAccountModel.updateOne).toBeCalledWith(
      {
        $or: [{ _id: undefined }, { email }],
      },
      { $set: { resetAt: someDate, resetToken: 'uniqueId' } },
      { runValidators: true },
    )
    expect(response).toEqual({
      resetToken: uuid.uniqueId,
    })
  })

  it('should start password reset by _id', async () => {
    const _id = 'some id'
    const AuthenticationAccountModel = {
      updateOne: jest.fn(() =>
        Promise.resolve({
          n: 1,
          ok: 1,
        }),
      ),
    }
    const response = await startPasswordReset({ AuthenticationAccountModel })({
      _id,
    })
    expect(AuthenticationAccountModel.updateOne).toBeCalledWith(
      {
        $or: [{ _id }, { email: undefined }],
      },
      { $set: { resetAt: someDate, resetToken: 'uniqueId' } },
      { runValidators: true },
    )
    expect(response).toEqual({
      resetToken: uuid.uniqueId,
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
      updateOne: jest.fn(() =>
        Promise.resolve({
          n: 0,
          ok: 1,
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
