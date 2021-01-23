const mongoose = require('mongoose')

const { checkPassword, checkPasswordFormat, generateRandomToken, hashPassword } = require('../helpers/models.helper')

const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'username is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true,
    immutable: true,
    trim: true,
    lowercase: true,
    match: [EMAIL_PATTERN, 'email format is invalid']
  },
  password: {
    type: String,
    required: [
      [true, 'password is required'],
      [checkPasswordFormat, 'the password must contains numbers and letters']
    ],
    minlength: [8, 'the password needs at least 8 chars']
  },
  validationToken: {
    type: String,
    default: generateRandomToken
  },
  validated: {
    type: Boolean,
    default: false
  },
  lastAccess: {
    type: Date,
    default: Date.now()
  }
},
{ timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = doc._id;
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      delete ret.validationToken;
      return ret;
    }
  }
})

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'user',
  justOne: false
})

userSchema.pre('save', function (next) {
  hashPassword(next, this)
})

userSchema.methods.checkUserPassword = function (password) {
  return checkPassword(password, this)
}

const User = mongoose.model('User', userSchema)

module.exports = User