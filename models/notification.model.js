const mongoose = require('mongoose')
const { Schema } = mongoose

const NotificationSchema = new Schema({
  notificationType: {
    type: String,
    required: true
  },

  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
  },

  target: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  source: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
},
)

const Notification = mongoose.model('Notification', NotificationSchema)

module.exports = Notification