import { Request, Response } from "express";
import mongoose from "mongoose";
import Post from '../models/posts'

export const addPost = async (req: Request, res: Response): Promise<any> => {
  try {


  } catch (error) {
    res.status(500).json({ status: false, message: "Server error." });
    console.log(error);
  }
}

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