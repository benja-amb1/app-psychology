import { Request, Response } from "express";
import mongoose from "mongoose";
import Post from '../models/posts'
import v from 'validator'


const cleanInputs = (field: string) => {
  return v.escape(field.trim());
};

export const addPost = async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, subtitle, description, content, year } = req.body;

    if (!title || !subtitle || !description || !content || !year) {
      return res.status(400).json({ status: false, message: "All fields are required." });
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
      year: cleanYear
    });

    await post.save();

    return res.status(200).json({ status: true, data: post });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server error." });
  }
};

export const deletePost = async (req: Request, res: Response): Promise<any> => {
  try {

  } catch (error) {
    res.status(500).json({ status: false, message: "Server error." });
    console.log(error);
  }
}

export const updatePost = async (req: Request, res: Response): Promise<any> => {
  try {

  } catch (error) {
    res.status(500).json({ status: false, message: "Server error." });
    console.log(error);
  }
}

export const getPost = async (req: Request, res: Response): Promise<any> => {
  try {

  } catch (error) {
    res.status(500).json({ status: false, message: "Server error." });
    console.log(error);
  }
}

export const getAllPosts = async (req: Request, res: Response): Promise<any> => {
  try {

  } catch (error) {
    res.status(500).json({ status: false, message: "Server error." });
    console.log(error);
  }
}

export const addComment = async (req: Request, res: Response): Promise<any> => {
  try {

  } catch (error) {
    res.status(500).json({ status: false, message: "Server error." });
    console.log(error);
  }
}

export const toggleLikes = async (req: Request, res: Response): Promise<any> => {
  try {

  } catch (error) {
    res.status(500).json({ status: false, message: "Server error." });
    console.log(error);
  }
}