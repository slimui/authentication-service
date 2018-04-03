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
      key: 'some_product_key',
      token: 'some_product_token' // send this with username and password to authenticate
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

### api/get

### api/productlinks/create

**Input**

```js
{
  email: 'admin@bufferapp.com',
  // or
  id: 'some_mongo_id',
  productName: 'reply'
}
```

**Output**

```js
// success
// code: 200
{
  success: true,
  productToken: 'some_product_token'
}
// fail -
//    missing/invalid email
//    missing/invalid id
//    missing/invalid productName
// code: 400
{
  success: false,
  message: 'Could not create product link'
}
```

### api/productlinks/remove

**Input**

```js
{
  email: 'admin@bufferapp.com',
  // or
  id: 'some_mongo_id',
  productName: 'reply'
}
```

**Output**

```js
// success
// code: 200
{
  success: true
}
// fail -
//    missing/invalid email
//    missing/invalid id
//    missing/invalid productName
// code: 400
{
  success: false,
  message: 'Could not remove product link'
}
```

### api/password/update

**Input**

```js
{
  email: 'admin@bufferapp.com',
  // or
  id: 'some_mongo_id',
  password: 'some_password',
  newPassword: 'some_new_password'
}
```

**Output**

```js
// success
// code: 200
{
  success: true
}
// fail -
//    missing/invalid email
//    missing/invalid id
//    missing password
//    missing newPassword
// code: 400
{
  success: false,
  message: 'Could not update password'
}
// fail -
//    invalid newPassword
// code: 400
{
  success: false,
  message: 'New password is invalid'
}
```

### api/password/reset/start

**Input**

```js
{
  email: 'admin@bufferapp.com',
  // or
  id: 'some_mongo_id'
}
```

**Output**

```js
// success
// code: 200
{
  success: true,
  resetToken: 'some_reset_token'
}
// fail - email or id
// code: 400
{
  success: false,
  message: 'Could not start reseting password'
}
```

### api/password/reset/complete

**Input**

```js
{
  email: 'admin@bufferapp.com',
  // or
  id: 'some_mongo_id',
  // and
  resetToken: 'some_reset_token',
  password: 'some_new_password'
}
```

**Output**

```js
// success
// code: 200
{
  success: true
}
// fail -
//    invalid email
//    invalid id
//    invalid/missing/expired reset token
//    invalid/missing password
// code: 400
{
  success: false,
  message: 'Could not reset password'
}
// fail -
//    invalid password
// code: 400
{
  success: false,
  message: 'Invalid password'
}
// fail -
//    expired reset token
// code: 400
{
  success: false,
  message: 'Password reset expired'
}
```

### api/login

**Input**

```js
{
  email: 'admin@bufferapp.com',
  // or
  id: 'some_mongo_id',
  // and
  password: 'some_password',
  productName: 'reply',
  productToken: 'some_product_token'
}
```

**Output**

```js
// success
// code: 200
{
  success: true
}
// fail - password + email combo
// code: 400
{
  success: false,
  message: 'Could not authenticate with credentials'
}

// fail - productName + productToken invalid
// code: 401
{
  success: false,
  message: 'Invalid product credentials'
}
```

## Environement Variables

```js
{
  RESET_TIMEOUT: 300, // seconds
}
```
