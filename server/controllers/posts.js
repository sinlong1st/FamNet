import User from "../models/User.js";
import Post from "../models/Post.js";

// CREATE (using POST)
export const createPost = async (req, res) => {
  try {
    const { userID, description, picturePath } = req.body;
    const user = await User.findById(userID);
    const newPost = new Post({
      userID: userID,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description: description,
      picturePath: picturePath,
      userPicturePath: user.picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();
    // Get all the posts (including the post we just created)
    const posts = await Post.find(); // We need this because after creating the post
    // We want also to return the new list of posts for the frontend to show to your newsfeed

    res.status(200).json(posts);
  } catch (err) {
    res.status(409), json({ message: err.message }); // HTTP status code 409 stands for "Conflict".
  }
};

// Get (READ)

export const getNewsFeed = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Get user posts
export const getUserPosts = async (req, res) => {
  try {
    const { userID } = req.params;
    const posts = await Post.find({ userID: userID });
    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Update

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userID } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userID);
    if (isLiked) {
      post.likes.delete(userID);
    } else {
      post.likes.set(userID, true);
    }
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
