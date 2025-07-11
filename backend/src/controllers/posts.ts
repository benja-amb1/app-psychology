import { Request, Response } from "express";
import mongoose from "mongoose";
import Post from '../models/posts'
import Comment from '../models/comments'
import v from 'validator'
import { UserReq } from "../interfaces/UserReq";

export interface FileRequest extends Request {
  file?: Express.Multer.File;
}

const cleanInputs = (field: string) => {
  return v.escape(field.trim());
};

export const addPost = async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, subtitle, description, content, year } = req.body;
    const image = req.file?.filename

    if (!title || !subtitle || !description || !content || !year) {
      return res.status(400).json({ status: false, message: "All fields are required." });
    }

    if (!image) {
      res.status(400).json({ status: false, message: "Image is required." });
      return
    }

    const cleanTitle = cleanInputs(title);
    const cleanSubtitle = cleanInputs(subtitle);
    const cleanDescription = cleanInputs(description);
    const cleanContent = cleanInputs(content);
    const cleanYear = cleanInputs(year);

    const post = new Post({
      title: cleanTitle,
      subtitle: cleanSubtitle,
      description: cleanDescription,
      content: cleanContent,
      year: cleanYear,
      image: image
    });

    await post.save();

    return res.status(200).json({ status: true, data: post });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server error." });
  }
};

export const deletePost = async (req: UserReq, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: "Invalid post ID." });
    }
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ status: false, message: "You are not authorized to delete this post." });
    }

    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ status: false, message: "Post not found." });
    }

    return res.status(200).json({ status: true, message: "Post deleted successfully." });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server error." });
  }
};

export const updatePost = async (req: UserReq, res: Response): Promise<any> => {
  try {
    const { title, subtitle, description, content, year } = req.body;
    const image = req.file?.filename
    const { id } = req.params;

    if (!title || !subtitle || !description || !content || !year) {
      return res.status(400).json({ status: false, message: "All fields are required." });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: "Invalid post ID." });
    }

    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ status: false, message: "You are not authorized to update this post." });
    }

    if (!image) {
      res.status(404).json({ status: false, message: "Image  is required." });
      return;
    }

    const cleanTitle = cleanInputs(title);
    const cleanSubtitle = cleanInputs(subtitle);
    const cleanDescription = cleanInputs(description);
    const cleanContent = cleanInputs(content);
    const cleanYear = cleanInputs(year);

    const postUpdated = await Post.findByIdAndUpdate(
      id,
      {
        title: cleanTitle,
        subtitle: cleanSubtitle,
        description: cleanDescription,
        content: cleanContent,
        year: cleanYear,
        image: image
      },
      { new: true }
    );

    if (!postUpdated) {
      return res.status(404).json({ status: false, message: "Post not found." });
    }

    return res.status(200).json({ status: true, data: postUpdated });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server error." });
  }
};

export const getPost = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: "Invalid post ID." });
    }

    const post = await Post.findById(id);

    if (!post) {
      res.status(404).json({ status: false, message: "Post not found." });
      return;
    }

    res.status(200).json({ status: true, data: post });

  } catch (error) {
    res.status(500).json({ status: false, message: "Server error." });
    console.log(error);
  }
}

export const getAllPosts = async (req: Request, res: Response): Promise<any> => {
  try {
    const posts = await Post.find();
    if (!posts) {
      res.status(404).json({ status: false, message: "Posts not found" });
      return;
    }

    res.status(200).json({ status: true, data: posts });

  } catch (error) {
    res.status(500).json({ status: false, message: "Server error." });
    console.log(error);
  }
}

export const addComment = async (req: UserReq, res: Response): Promise<any> => {
  try {
    const { postId } = req.params;
    const { comment } = req.body;
    const userId = req.user?.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ status: false, message: "Invalid post ID." });
    }

    if (!comment) {
      return res.status(400).json({ status: false, message: "Comment is required." });
    }

    if (!userId) {
      return res.status(401).json({ status: false, message: "Unauthorized." });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ status: false, message: "Post not found." });
    }

    const cleanComment = cleanInputs(comment);

    const newComment = new Comment({
      postId,
      userId,
      comment: cleanComment
    });

    await newComment.save();

    return res.status(201).json({
      status: true,
      message: "Comment added successfully.",
      data: newComment
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server error." });
  }
};

export const getCommentsByPost = async (req: Request, res: Response): Promise<any> => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ status: false, message: "Invalid post ID." });
    }

    const comments = await Comment.find({ postId })
      .populate("userId", "name surname") // show the name and surname
      .sort({ createdAt: -1 }); // recents firsts

    return res.status(200).json({ status: true, data: comments });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server error." });
  }
};

export const toggleLikes = async (req: UserReq, res: Response): Promise<any> => {
  try {
    const { postId } = req.params;
    const userId = req.user?.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      res.status(404).json({ status: false, message: "Invalid ID" });
      return
    }

    if (!userId) {
      res.status(401).json({ status: false, message: "Unauthorized" });
      return
    }

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ status: false, message: "Post not found" });
      return
    }

    const userIndex = post.likes.findIndex((id) => id.equals(userId));

    if (userIndex > -1) {
      // quitar like si el usuario ya le dio like
      post.likes.splice(userIndex, 1);
    } else {
      // agregar like si el usuario NO dio like
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      status: true,
      message: userIndex > -1 ? "Like removed" : "Like added",
      likesCount: post.likes.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Server error." });
  }
};