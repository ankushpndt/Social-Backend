const express = require("express");
const router = express.Router();
const {getUserAndFriendPosts,postNewPost,removePost,getPostById,
getPostLikes,userPosts,
addPostLikes,getComments,postUserComment,removeUserComment} = require("../controller/post.controller")
router.route("/getall/:userId")
.get(getUserAndFriendPosts)
router.route("/")
.post(postNewPost)
.put(removePost)

router.param("postId",getPostById)
router.get("/:userId",userPosts)
router.route("/:postId/like")
.get(getPostLikes)
.post(addPostLikes)

router.route("/:postId/comment")
.get(getComments)
.post(postUserComment)
.put(removeUserComment)
module.exports = router;