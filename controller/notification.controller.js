
const Notification = require('../models/notification.model.js')

async function getUserNotifications(req, res) {
   let { _id } = req.user 
  try {
 
    let notifications = await Notification.find({target:_id}).populate({
      path: 'post'}).populate({ path: 'source', select: 'name image' })
    if (!notifications) {
      notifications = []
    }

    res.status(200).json({ success: true, message: "Fetched current user notification successfully.", data: notifications })
  } catch (err) {
    res.status(500).json({ success: false, message: "No new notifications found", errorMessage: err.message })
  }
}
async function addNotification(req, res) {
  try {
    const { postId, target, notificationType } = req.body
    const { _id } = req.user
    const notification = await Notification.create({ postId, target, source: _id, notificationType })

    res.json({ success: true, message: "Notification added successfully", data: notification })
  }

  catch (err) {
    res.status(500).json({ success: false, message: "Failed to add this notification", errorMessage: err.message })
  }
}
async function updateUserNotifications(req, res) {
  try {
    let { notificationId } = req.body
    let notification = await Notification.findById(notificationId)
    notification.read = true
    notification = await notification.save()
    res.status(200).json({ success: true, message: "Notification removed successfully", data: notification })

  } catch (err) {
    res.status(500).json({ success: false, message: "Unable to remove notification", errorMessage: err.message })
  }
}

module.exports = { getUserNotifications, updateUserNotifications, addNotification }