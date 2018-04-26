const bcrypt = require('bcryptjs')
const { promisify } = require('util')
const mongoose = require('mongoose')
require('mongoose-type-email')

const { Schema, SchemaTypes } = mongoose
const hash = promisify(bcrypt.hash)

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
        name: {
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
      'productlinks.name': 1,
      'productlinks.foreignKey': 1,
    },
    { unique: true },
  )
  // hash the password before storing
  authenticationAccountSchema.pre('save', async function() {
    this.password = await hash(this.password, 10)
  })
  return mongooseConnection.model(
    'AuthenticationAccount',
    authenticationAccountSchema,
  )
}