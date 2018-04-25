const createProductlink = require('../src/createProductlink')
const { ObjectID } = require('mongodb')

describe('createProductlink', () => {
  it('should export a function', () => {
    expect(createProductlink).toBeDefined()
  })

  it('should create a product link by id', async () => {
    const id = 'some user id'
    const productName = 'some product name'
    const foreignKey = 'some foreign key'
    const collectionClient = {
      updateOne: jest.fn(() =>
        Promise.resolve({
          matchedCount: 1,
        }),
      ),
    }
    const response = await createProductlink({ collectionClient })({
      id,
      productName,
      foreignKey,
    })
    expect(response).toEqual({
      success: true,
    })
    expect(collectionClient.updateOne).toBeCalledWith(
      {
        _id: ObjectID(id),
      },
      {
        $set: {
          [`productlinks.${productName}`]: {
            foreignKey,
          },
        },
      },
    )
  })
  it('should create a product link by email', async () => {
    const email = 'e@mail.com'
    const productName = 'some product name'
    const foreignKey = 'some foreign key'
    const collectionClient = {
      updateOne: jest.fn(() =>
        Promise.resolve({
          matchedCount: 1,
        }),
      ),
    }
    const response = await createProductlink({ collectionClient })({
      email,
      productName,
      foreignKey,
    })
    expect(response).toEqual({
      success: true,
    })
    expect(collectionClient.updateOne).toBeCalledWith(
      {
        email,
      },
      {
        $set: {
          [`productlinks.${productName}`]: {
            foreignKey,
          },
        },
      },
    )
  })
})
