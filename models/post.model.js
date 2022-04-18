const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "User id not specified"],
  },
  comment: {
    type: String,
    required: [true, "Please write the comment"]
  },
  time: {
    type: Date,
    default: Date.now
  },
  active: Boolean
});

const postSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  description: {
    type: String,
    required: [true, "Please write the description"]
  },
  date: {
    type: String,

  },
  media: {
    type: String,
    default: '',
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [commentSchema],
  active: Boolean
}
)


const Post = new mongoose.model("Post", postSchema);

module.exports = Post;