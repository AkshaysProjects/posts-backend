const db = require("../db/index.js");
const Post = require("../models/post.js");
const ObjectId = require("mongoose").Types.ObjectId;

// Get all posts
const getPosts = async (req, res) => {
  try {
    // Fetch the posts collection from the database
    const posts = db.collection("posts");

    // Convert the posts collection to an array
    const allPosts = await posts.find().toArray();

    // Send the response back to the client
    res.json(allPosts);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
      error: error.message,
    });
  }
};

// Get a single post
const getPostById = async (req, res) => {
  try {
    // Fetch the posts collection from the database
    const posts = db.collection("posts");

    // Find the post with the given id
    const post = await posts.findOne({ _id: new ObjectId(req.params.id) });

    // Check if the post with the given id exists
    if (!post) {
      res.status(404).json({ success: false, message: "Post not found" }); // 404 Not Found
    } else {
      res.json(post);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch post",
      error: error.message,
    });
  }
};

// Create a new post
const createPost = async (req, res) => {
  try {
    // Fetch the posts collection from the database
    const posts = db.collection("posts");

    // Check if the post with the given id exists
    const existingPost = await posts.findOne({
      _id: new ObjectId(req.params.id),
    });
    if (existingPost) {
      // 409 Conflict
      res.status(409).json({
        success: false,
        message: "Post with ID" + req.body.id + " already exists",
      });
    } else {
      // Create an instance of the Post model with the given data
      const post = new Post({
        userId: req.body.userId,
        title: req.body.title,
        body: req.body.body,
      });

      // Insert the post into the collection
      await posts.insertOne(post);

      // Send the response back to the client
      res.status(201).json({ success: true, message: "Post Created", post: post });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create post",
      error: error.message,
    });
  }
};

// Update a post
const updatePost = async (req, res) => {
  try {
    // Fetch the posts collection from the database
    const posts = db.collection("posts");

    // Find the post with the given id and update it with the given data
    const result = await posts.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body },
      { returnDocument: "after" }
    );

    // Check the result of the update
    if (result) {
      res.json({ success: true, message: "Post updated", post: result });
    } else {
      res.status(404).json({ success: false, message: "Post not found" }); // 404 Not Found
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update post",
      error: error.message,
    });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  try {
    // Fetch the posts collection from the database
    const posts = db.collection("posts");

    // Find the post with the given id and delete it
    const result = await posts.deleteOne({ id: new ObjectId(req.params.id) });

    // Check the result of the delete
    if (result.deletedCount === 0) {
      res.status(404).json({ success: false, message: "Post not found" }); // 404 Not Found
    } else {
      res.json({ success: true, message: "Post deleted" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete post",
      error: error.message,
    });
  }
};

// Export the controllers
module.exports = { getPosts, getPostById, createPost, updatePost, deletePost };
