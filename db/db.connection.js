const mongoose = require("mongoose");

const initializeDbConnection = async () => {
  try {
    await mongoose.connect("mongodb+srv://ankushpndt:Intruder@cluster0.3eh5k.mongodb.net/socialMediaDb?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("successfully connected");
  } catch (error) {
    console.error(
      "mongoose connection failed, kindly check connectivity",
      error
    );
  }
};

module.exports = initializeDbConnection;