const bcrypt = require('bcryptjs')
const { promisify } = require('util')
const mongoose = require('mongoose')
require('mongoose-type-email')

const { Schema, SchemaTypes } = mongoose
const hash = promisify(bcrypt.hash)
const compare = promisify(bcrypt.compare)

MIN_PASSWORD_LENGTH = 8
MAX_PASSWORD_LENGTH = 128

module.exports = ({ mongooseConnection }) => {
  const authenticationAccountSchema = Schema({
    email: {
      type: SchemaTypes.Email,
      required: true,
      index: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [
        MIN_PASSWORD_LENGTH,
        `shorter than min length (${MIN_PASSWORD_LENGTH})`,
      ],
      maxlength: [
        MAX_PASSWORD_LENGTH,
        `longer than max length (${MAX_PASSWORD_LENGTH})`,
      ],
    },
    productlinks: [
      {
        _id: false,
        productName: {
          type: String,
          required: true,
        },
        foreignKey: {
          type: String,
          required: true,
        },
      },
    ],
    resetToken: String,
    resetAt: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    lastLoginAt: Date,
  })
  authenticationAccountSchema.index(
    {
      'productlinks.productName': 1,
      'productlinks.foreignKey': 1,
    },
    { unique: true },
  )
  // hash the password before storing
  authenticationAccountSchema.pre('save', async function() {
    this.password = await hash(this.password, 10)
    this.updatedAt = new Date()
  })
  authenticationAccountSchema.methods.verifyPassword = async function({
    password,
  }) {
    return await compare(password, this.password)
  }
  authenticationAccountSchema.methods.verifyResetToken = async function({
    resetToken,
  }) {
    const now = new Date().getTime()
    const expireTime = this.resetAt.getTime() + process.env.RESET_TIMEOUT * 1000
    return resetToken === this.resetToken && expireTime >= now
  }
  return mongooseConnection.model(
    'AuthenticationAccount',
    authenticationAccountSchema,
  )
}
