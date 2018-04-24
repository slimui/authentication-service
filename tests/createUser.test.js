const createUser = require('../src/createUser')

describe('createUser', () => {
  it('should export a createUser function', () => {
    expect(createUser).toBeDefined()
  })
})
