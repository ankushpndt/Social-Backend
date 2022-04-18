const jwt = require('jsonwebtoken')
const bcrypt = require("bcryptjs");
const { extend } = require("lodash")
const User = require('../models/user.model')

const getAllUser = async (req, res) => {
  try {
    let user = await User.find({});
    user = user.map((user) => {
      user.password = undefined;
      return user;
    })
    res.status(200).json({ success: true, message: "All users fetched successfully.", user })
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to fetch users", errorMessage: error.message })
  }
}
//register user
const signup = async (req, res) => {
  const { name, email, password } = req.body

  try {
    if (!name) res.status(404).json({ message: "Please enter your Name." })
    if (!email) res.status(404).json({ message: "Please enter your Email Id." })
    if (!password) res.status(404).json({ message: "Please enter your Password." })

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)


    if (email) {
      //finding user
      const user = await User.findOne({ email })
      if (user) {
        //checking if user exists
        if (email === user.email) res.json({ message: "This email id already exists." })
      }
      else {
        //creating new user
        const newUser = new User({ name, email, password: hashPassword })
        const saveUser = await newUser.save()
        const token = jwt.sign({ _id: saveUser._id }, 'ankush')
        res.header("auth-token").json({
          success: true,
          userid: saveUser._id,
          token: token,
          userName: saveUser.name,
        })
      }
    }

    else {
      //user not found
      res.status(404).json({ message: `No user found which has email id ${email}` })
    }
  }
  catch (error) {

    res.json({
      success: false,
      message: "Not able to add User",
      errorMessage: error,
    });
  }
}

//signing in 
const login = async (req, res) => {
  try {
    //checking if user's email is already present
    const { email, password } = req.body
    if (!email) res.status(404).json({ message: "Please enter your Email Id." })

    if (!password) res.status(404).json({ message: "Please enter your Password." })
    const user = await User.findOne({ email })

    if (!user) res.status(404).json({ message: "This email id does not exist." })

    else {
      const validPass = await bcrypt.compare(password, user.password)
      if (!validPass) {
        res.status(401).json({ success: false, message: "Incorrect Password" });
      }
      else {
        //create token and assign
        const token = jwt.sign({ _id: user._id }, 'ankush')
        res.header("auth-token").json({
          success: true,
          userid: user._id,
          token: token,
          userName: user.name,
        })
      }
    }
  }
  catch (error) {

    res.status(400).json({ success: false, message: error.message });
  }
}
// after middle
const getUserById = async (req, res) => {
  let { user } = req;
  user = await User.findOne({ _id: user._id })
  user.password = undefined;
  res.status(200).json({ success: true, user })
}

// update user details
const updateUserDetails = async (req, res) => {
  try {
    let { user } = req;
    user = await User.findOne({ _id: user._id });
    const updateData = req.body;

    user = extend(user, updateData)

    await user.save();
    user.password = undefined;

    res.status(200).json({ success: true, message: "Current user details updated successfully.", user })
  } catch (error) {
    console.log(error)
    res.status(400).json({ success: false, message: "Failed to update current user details", errorMessage: error.message })
  }
}

// update user followers 
const followUser = async (req, res) => {

  if (req.body.userId !== req.params.id) {
    try {
      const userToBeFollowed = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!userToBeFollowed.followers.includes(req.body.userId)) {

        userToBeFollowed.followers.push(req.body.userId)

        currentUser.following.push(req.params.id)
        await userToBeFollowed.save()
        await currentUser.save()
        res.status(200).json({ success: true, message: "User has been followed", userToBeFollowed, currentUser });
      } else {
        res.status(403).json("You already follow this user");
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Request failed please check errorMessage key for more details", errorMessage: error.message });
    }
  } else {
    res.status(403).json("You can't follow yourself");
  }
}
const unfollowUser = async (req, res) => {
  const profileId = req.params.id


  if (req.body.userId !== req.params.id) {
    try {
      const userToBeUnFollowed = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (userToBeUnFollowed.followers.includes(req.body.userId)) {

        userToBeUnFollowed.followers = userToBeUnFollowed.followers.filter(user => (user._id != req.body.userId))

        currentUser.following = currentUser.following.filter(user => (user._id != req.params.id))
        await userToBeUnFollowed.save()
        await currentUser.save()
        res.status(200).json({ success: true, message: "User has been unfollowed", currentUser, userToBeUnFollowed });
      } else {
        res.status(403).json("You don't follow this user");
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Request failed please check errorMessage key for more details", errorMessage: error.message });
    }
  } else {
    res.status(403).json("You can't unfollow yourself");
  }
}

module.exports = {
  getAllUser,
  signup, login,
  getUserById,
  updateUserDetails,
  followUser, unfollowUser
};
