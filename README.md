# Authentication Service

Buffer Authentication Service

## Model

```js
{
  _id: ObjectId('some_mongo_id')
  email: 'admin@bufferapp.com', // unique
  password: 'one_way_hashed',
  productlinks: [
    {
      name: 'reply',
      token: 'some_uuid' // send this with username and password to authenticate
    }
  ],
  resetToken: 'some_reset_token',
  resetAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  lastLoginAt: new Date(),
  data: {} // bucket of any data we'll want to persist (future proofing)
}
```

## API

All of these requests are POST and parameters are passed in the request body.

### api/create

### api/productlinks/create

### api/productlinks/get

### api/productlinks/remove

### api/password/update

### api/password/reset/start

### api/password/reset/complete

### api/login
