const express = require('express')
// const {Notification} = require('../models/notification.model.js')
const verifyToken = require('../middlewares/verifyToken')
const {getUserNotifications, updateUserNotifications,addNotification} = require('../controller/notification.controller.js')

const router = express.Router()

router.use(verifyToken)

router.route('/')
.get(getUserNotifications)
.put(updateUserNotifications)
.post(addNotification)

module.exports = router