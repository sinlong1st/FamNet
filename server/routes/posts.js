import express from "express";
import { createPost, deletePost, showPost } from "../controllers/posts.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();
/* Get(read) */
router.get("/:id", verifyToken, getPost);
router.get("/:id/friends", verifyToken, getUserFriends);

// Update
router.patch("/:id/:friendID", verifyToken, addRemoveFriend);

export default router;
