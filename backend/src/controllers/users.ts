import User from '../models/users'
import { UserReq } from '../interfaces/UserReq'
import { Response, Request } from 'express'
import v from 'validator';
import mongoose from 'mongoose';

const cleanInputs = (field: string) => {
  return v.escape(field.trim());
};

const createUserWithRole = (role: string) => async (req: Request, res: Response) => {
  try {
    const { name, surname, email, password } = req.body;

    if (!name || !surname || !email || !password) {
      res.status(400).json({ status: false, message: "All fields are required." });
      return
    }

    const user = new User({
      name: cleanInputs(name),
      surname: cleanInputs(surname),
      email: cleanInputs(email),
      password: cleanInputs(password),
      role
    });

    await user.save();

    res.status(201).json({ status: true, message: `User with role ${role} created.` });
  } catch (error) {
    res.status(500).json({ status: false, message: "Server error." });
  }
};

export const createUser = createUserWithRole('user');
export const createAdmin = createUserWithRole('admin');
export const createSemiAdmin = createUserWithRole('semiadmin');

export const updateUser = async (req: UserReq, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { name, surname, email, password } = req.body;

    if (!name || !surname || !email || !password) {
      return res.status(400).json({ status: false, message: "All fields are required." });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ status: false, message: "Invalid ID." });
      return;
    }

    if (req.user?.id.toString() !== id) {
      res.status(404).json({ status: false, message: "You can't update this user." });
      return;
    }

    const user = await User.findByIdAndUpdate(id, {
      name: cleanInputs(name),
      surname: cleanInputs(surname),
      email: cleanInputs(email),
      password: cleanInputs(password),
    }, { new: true });

    if (!user) {
      res.status(404).json({ status: false, message: "User not found." });
      return;
    }

    res.status(200).json({ status: true, message: "User updated successfully.", data: user });

  } catch (error) {
    res.status(404).json({ status: false, message: "Server error." });
  }
}

export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  try {

  } catch (error) {

  }
}

export const getUser = async (req: Request, res: Response): Promise<any> => {
  try {

  } catch (error) {

  }
}

export const getAllUsers = async (req: Request, res: Response): Promise<any> => {
  try {

  } catch (error) {

  }
}

export const login = async (req: Request, res: Response): Promise<any> => {
  try {

  } catch (error) {

  }
}

export const logout = async (req: Request, res: Response): Promise<any> => {
  try {

  } catch (error) {

  }
}

export const getSession = async (req: Request, res: Response): Promise<any> => {
  try {

  } catch (error) {

  }
}