const uuid = require('uuid/v4')
const bcrypt = require('bcryptjs')
const { promisify } = require('util')
const mongoose = require('mongoose')
require('mongoose-type-email')

const { Schema, SchemaTypes } = mongoose
const hash = promisify(bcrypt.hash)
const compare = promisify(bcrypt.compare)

const MIN_PASSWORD_LENGTH = 8
const MAX_PASSWORD_LENGTH = 128

module.exports = ({ mongooseConnection }) => {
  const authenticationAccountSchema = Schema({
    email: {
      type: SchemaTypes.Email,
      required: true,
      index: true,
      unique: true,
    },
    hashedPassword: {
      type: String,
      required: true,
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

  // bump the updatedAt feild on save
  authenticationAccountSchema.pre('save', async function() {
    this.updatedAt = new Date()
  })

  authenticationAccountSchema.methods.setPassword = async function({
    password,
  }) {
    if (!password) throw new Error('Password is required')
    if (typeof password !== 'string')
      throw new Error('Password must be a String')
    if (password.length < MIN_PASSWORD_LENGTH)
      throw new Error(
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
      )
    if (password.length > MAX_PASSWORD_LENGTH)
      throw new Error(
        `Password must be less than ${MAX_PASSWORD_LENGTH} characters`,
      )
    this.hashedPassword = await hash(password, 10)
  }

  authenticationAccountSchema.methods.verifyPassword = async function({
    password,
  }) {
    return await compare(password, this.hashedPassword)
  }

  authenticationAccountSchema.methods.verifyResetToken = function({
    resetToken,
  }) {
    const now = new Date().getTime()
    const expireTime = this.resetAt.getTime() + process.env.RESET_TIMEOUT * 1000
    return resetToken === this.resetToken && expireTime >= now
  }

  authenticationAccountSchema.methods.verifyProductName = function({
    productName,
  }) {
    return !!this.productlinks.find(link => link.productName === productName)
  }

  authenticationAccountSchema.statics.findOneByIdOrEmail = async function({
    _id,
    email,
    select,
  }) {
    if (select) {
      return await this.findOne({ $or: [{ _id }, { email }] })
        .select(select)
        .exec()
    }
    return await this.findOne({ $or: [{ _id }, { email }] }).exec()
  }

  authenticationAccountSchema.statics.createResetToken = async function({
    _id,
    email,
  }) {
    const resetToken = uuid()
    const result = await AuthenticationAccountModel.updateOne(
      { $or: [{ _id }, { email }] },
      {
        $set: {
          resetAt: new Date(),
          resetToken,
        },
      },
      { runValidators: true },
    )
    return {
      result,
      resetToken,
    }
  }

  authenticationAccountSchema.statics.removeProductlink = async function({
    _id,
    email,
    productName,
  }) {
    const result = await AuthenticationAccountModel.updateOne(
      { $or: [{ _id }, { email }] },
      {
        $pull: {
          productlinks: {
            productName,
          },
        },
      },
    )
    return {
      result,
    }
  }

  authenticationAccountSchema.statics.createProductlink = async function({
    _id,
    email,
    productName,
    foreignKey,
  }) {
    const result = await AuthenticationAccountModel.updateOne(
      { $or: [{ _id }, { email }] },
      {
        $addToSet: {
          productlinks: {
            productName,
            foreignKey,
          },
        },
      },
      { runValidators: true },
    )
    return {
      result,
    }
  }

  return mongooseConnection.model(
    'AuthenticationAccount',
    authenticationAccountSchema,
  )
}
