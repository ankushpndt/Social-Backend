const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserProfileSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
  },
  name: {
    type: String,
    required: [true, "Please enter your name"]
  },

  email: {
    type: String,
    required: [true, "Please enter your email"]
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],

  },
  bio: {
    type: String,
  },
  link: {
    type: String
  },
  image: {
    type: String,
    default: "https://i.ibb.co/B2tYKC7/Picture-profile-icon-Male-icon-Human-or-people-sign-and-symbol-Vector-illustration.jpg"
  },
  followers: [
    { type: Schema.Types.ObjectId, ref: 'User' }
  ],
  following: [
    {
      type: Schema.Types.ObjectId, ref: 'User'
    }
  ],


}, { timestamps: true })


const User = mongoose.model("User", UserProfileSchema);

module.exports = User;