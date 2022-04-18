const express = require("express")
const app = express();
const server = require("http").createServer(app)
const io = require('socket.io')(server, {
  cors:
    { origin: 'https://ligmasocial.netlify.app' }

})
const cors = require("cors")
const initializeDbConnection = require("./db/db.connection");
initializeDbConnection()
const PORT = process.env.PORT || 5000;
const userRoute = require("./routes/user.route")
const postRoute = require("./routes/post.route")
const notificationRoute = require("./routes/notification.route")
const Notification = require('./models/notification.model')
app.use(express.json())
app.use(cors())
app.use("/user", userRoute)
app.use("/post", postRoute)
app.use("/notification", notificationRoute)
app.use("/", (req, res) => {
  res.send("Social Media Backend")
})

app.get("*", (req, res) => {
  res.status(400).json("Page Not Found");
})
let onlineUsers = [];

const addNewUser = (userId, socketId) => {
  !onlineUsers.some((user) => user.userId === userId) &&
    onlineUsers.push({ userId, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};


io.on("connection", (socket) => {
  try {
    socket.on("addUser", async (userId) => {
      console.log("User to be added", userId)
      addNewUser(userId, socket.id);
      const receiver = getUser(userId);
      console.log("Receiver-> ", receiver)
      let notifications = await Notification.find({ target: userId }).populate({
        path: 'post'
      }).populate({ path: 'source', select: 'name image' })
      if (receiver) {
        io.to(receiver.socketId).emit("getNotification", notifications);
      }

    });
  }
  catch (error) {
    console.log(error)
  }
  try {
    socket.on("sendNotification", async ({ postId, senderId, receiverId, type }) => {

      const notification = await Notification.create({ postId, target: receiverId, source: senderId, notificationType: type })

      await notification.save()
      const receiver = getUser(receiverId);
      console.log("Receiver-> ", receiver)
      let notifications = await Notification.find({ target: receiverId }).populate({
        path: 'post'
      }).populate({ path: 'source', select: 'name image' })

      if (receiver) {
        io.to(receiver.socketId).emit("getNotification", notifications);
      }

    });
  }
  catch (error) {
    console.log(error)
  }

  try {
    socket.on("sendClearNotification", async ({ id, receiverId }) => {
      let notification = await Notification.findById({ _id: id })
      console.log("clearNoti", notification)
      let deletedNoti = await notification.deleteOne()
      console.log(deletedNoti)
      const receiver = getUser(receiverId);
      if (receiver) {
        io.to(receiver.socketId).emit("getClearNotification", deletedNoti);
      }
    })
  }
  catch (error) {
    console.log(error)
  }
  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

server.listen(PORT, () => console.log(`Server started at ${PORT}`))

