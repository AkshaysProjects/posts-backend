const mongoose = require("mongoose");
const Post = require("./models/post");
const postsData = require("./data/posts");
require("dotenv").config();

const DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://localhost:27017/yourDatabaseName";

mongoose
  .connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const refreshPostsCollection = async () => {
  try {
    await Post.deleteMany({});
    const inserted = await Post.insertMany(postsData);
    console.log(`${inserted.length} posts were successfully added.`);
  } catch (err) {
    console.error("Error refreshing the posts collection:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
};

refreshPostsCollection();
