const mongoose = require('mongoose')

const { calculateFinalPriority, setCurrentDateToToDoDate } = require('../helpers/models.helper')

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'user is required'],
  },
  keyword: {
    type: String,
    required: [true, 'keyword is required'],
    uppercase: true,
    maxlength: [10, 'keyword can contain 10 chars maximun']
  },
  title: {
    type: String,
    required: [true, 'title is required'],
    uppercase: true,
  },
  description: {
    type: String,
  },
  userPriority: {
    type: Number,
    required: [true, 'priority is required'],
    enum: [1, 2, 3, 4, 5]
  },
  date: {
    toDo: {
      type: Date,
      required: [true, 'toDoDate is required']
    },
    limit: {
      type: Date,
      required: [true, 'limitDate is required']
    },
    current: {
      type: Date
    }
  },
  done: {
    type: Boolean,
    default: false
  }
},
{ timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = doc._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
})

taskSchema.virtual('finalPriority')
  .get(function() {
    return calculateFinalPriority(this)
  })

taskSchema.pre('save', function (next) {
  setCurrentDateToToDoDate(next, this)
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task