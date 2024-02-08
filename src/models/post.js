const mongoose = require("mongoose");

// Define the Post Schema
const PostSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
});

// Export the Post model
const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
