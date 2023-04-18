import express from "express";
import { getNewsFeed, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();
/* Get(read) */
router.get("/", verifyToken, getNewsFeed);
router.get("/:userID/posts", verifyToken, getUserPosts);

// Update
// Like or unlike the post
router.patch("/:id/like", verifyToken, likePost);

export default router;
