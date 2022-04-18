const Post = require("../models/post.model");
const User = require('../models/user.model')
//userPosts
const userPosts = async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId)
    let userPosts = await Post.find({ userId: currentUser._id });
    res.status(200).json({ success: true, message: "Fetched current user's posts successfully.", userPosts })
  }
  catch (error) {
    res.status(400).json({ success: false, message: "Failed to fetch current user's post", errorMessage: error.message })
  }
}
//getUserAndFriendPosts
const getUserAndFriendPosts = async (req, res) => {

  try {
    const currentUser = await User.findById(req.params.userId)
    let userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(currentUser.following.map((friendId) => {
      return Post.find({ userId: friendId })
    }))
    let bothPosts = userPosts.concat(...friendPosts)
    res.status(200).json({ success: true, message: "Yours and your's followers posts fetched successfully.", bothPosts })
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to fetch yours and your's followers posts.", errorMessage: error.message })
  }
}


//NewPost
const postNewPost = async (req, res) => {

  try {
    const { _id } = req.body;
    const { description, media } = req.body;


    let newPost = new Post({ description: description, media: media });
    newPost.userId = _id;
    newPost.active = true;
    newPost = await newPost.save()
    res.status(200).json({ success: true, message: "Post added successfully", newPost })
  } catch (error) {

    res.status(400).json({ success: false, message: "Failed to add this post", errorMessage: error.message })
  }
}

// RemovePost 
const removePost = async (req, res) => {

  try {

    const { postId } = req.body;
    const post = await Post.findById({ _id: postId });
    if (post.userId == req.body.userId) {
      const deletedPost = await post.deleteOne();

      res.status(200).json({ message: "This post has been deleted", deletedPost });
    } else {
      res.status(403).json("You can delete only your post");
    }

  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to delete this post", errorMessage: error.message })
  }
}

// getPostById for Params 
const getPostById = async (req, res, next, postId) => {
  try {

    let post = await Post.findById({ _id: postId })
    if (!post) {
      res.json({ success: false, message: "Unable to find Post" })
    }
    req.post = post;
    next();
  } catch (error) {
    res.status(400).json({ success: false, message: "Request failed please check errorMessage key for more details", errorMessage: error.message })
  }
}


// get all likes 

const getPostLikes = async (req, res) => {
  try {
    const { post } = req;
    let user = await post.populate({ path: "likes", select: "username" }).execPopulate();
    res.status(200).json({ success: true, message: "Likes fetched successfully", users: user.likes })
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to fetch likes", errorMessage: error.message })
  }
}
//AddLikes
const addPostLikes = async (req, res) => {

  try {

    let { post } = req;
    const { _id } = req.body;

    if (post.likes.includes(_id)) {
      post.likes = post.likes.filter((like) => like != _id)
    } else {
      post.likes.push(_id)
    }
    post = await post.save();

    res.status(200).json({ success: true, message: "Liked this post successfully", post })
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to like this post", errorMessage: error.message })
  }
}


// for getComments
const getComments = async (req, res) => {
  try {
    const { postId } = req.params
    let userPost = await Post.findById(postId)
    userPost.comments = userPost.comments.filter((comment) => comment.active)
    res.status(200).json({ success: true, comments: userPost.comments })
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to fetch comments", errorMessage: error.message })
  }
}
//New Comment
const postUserComment = async (req, res) => {

  try {
    let { post } = req;
    const { _id, comment } = req.body
    let newComment = {}
    newComment.userId = _id;
    newComment.comment = comment;
    newComment.active = true;
    post.comments.push(newComment)
    post = await post.save();
    res.status(200).json({ success: true, message: "Comment posted successfully", comments: post })
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to post this comment", errorMessage: error.message })
  }
}
const removeUserComment = async (req, res) => {
  try {
    const { commentId, postId } = req.body
    let post = await Post.findById({ _id: postId })
    let updatedComments = post.comments.filter(comment => comment._id != commentId)
    post.comments = updatedComments
    await post.save()
    const tempPost = await Post.findOne({ _id: postId }).populate({
      path: "comments.userId",
      populate: { path: "userId" },
      select: "-email -password -__v",
    });

    res.json({
      status: true,
      message: "Comment deleted successfully",
      post: tempPost,
    });
  }
  catch (error) {
    res.status(400).json({ success: false, message: "Failed to delete this comment", errorMessage: error.message })
  }
}
module.exports = {
  getUserAndFriendPosts,
  postNewPost,
  removePost,
  getPostById,
  getPostLikes,
  addPostLikes,
  getComments,
  postUserComment,
  removeUserComment,
  userPosts
}