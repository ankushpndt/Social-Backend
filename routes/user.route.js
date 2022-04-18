
const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken")
const {getAllUser,signup,login,getUserById,updateUserDetails,followUser,unfollowUser} = require("../controller/user.controller")


router.route("/getall")
.get(getAllUser)

router.route("/login")
.post(login)

router.route("/signup")
.post(signup)

router.use(verifyToken);

router.route("/")
.get(getUserById)
.post(updateUserDetails)
router.put("/:id/follow",followUser)
router.put("/:id/unfollow",unfollowUser)


module.exports = router;