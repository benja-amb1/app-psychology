import User from '../models/users'
import { UserReq } from '../interfaces/UserReq'
import { Response, Request } from 'express'
import v from 'validator';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const cleanInputs = (field: string) => {
  return v.escape(field.trim());
};

const createUserWithRole = (role: string) => async (req: Request, res: Response) => {
  try {
    const { name, surname, email, password } = req.body;

    if (!name || !surname || !email || !password || !v.isEmail(email)) {
      res.status(400).json({ status: false, message: "All fields are required." });
      return
    }

    const existsEmail = await User.findOne({ email });
    if (existsEmail) {
      res.status(404).json({ status: false, message: "Email already exits." });
      return;
    }

    const hashed = await bcrypt.hash(password, 10)

    const user = new User({
      name: cleanInputs(name),
      surname: cleanInputs(surname),
      email: cleanInputs(email),
      password: hashed,
      role
    });

    await user.save();

    res.status(201).json({ status: true, message: `User created.` });
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

    if (!name || !surname || !email || !password || !v.isEmail(email)) {
      return res.status(400).json({ status: false, message: "All fields are required." });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ status: false, message: "Invalid ID." });
      return;
    }



    if (!req.user || !req.user.id || req.user.id.toString() !== id) {
      return res.status(403).json({ status: false, message: "You can't update this user." });
    }

    const emailExists = User.findOne({ id, $ne: email });
    if (!emailExists) {
      res.status(404).json({ status: false, message: "Email already exists." });
      return;
    }


    const hashed = await bcrypt.hash(password, 10)

    const user = await User.findByIdAndUpdate(id, {
      name: cleanInputs(name),
      surname: cleanInputs(surname),
      email: cleanInputs(email),
      password: hashed,
    }, { new: true }).select('-password');

    if (!user) {
      res.status(404).json({ status: false, message: "User not found." });
      return;
    }

    res.status(200).json({ status: true, message: "User updated successfully.", data: user });

  } catch (error) {
    res.status(500).json({ status: false, message: "Server error." });
    console.log(error);
  }
}

export const deleteUser = async (req: UserReq, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ status: false, message: "Invalid user ID." });
      return;
    }

    if (req.user?.id.toString() !== id) {
      res.status(404).json({ status: false, message: "You can't delete this user." });
      return;
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      res.status(404).json({ status: false, message: "Canno't delete the user." });
      return;
    }

    res.status(200).json({ status: true, message: "User deleted successfully." });

  } catch (error) {
    res.status(404).json({ status: false, message: "Server error." });
    console.log(error);
  }
}

export const getUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ status: false, message: "Invalid user ID." });
      return;
    }

    const user = await User.findById(id).select('-password');
    if (!user) {
      res.status(404).json({ status: false, message: "User not found" });
      return;
    }

    res.status(200).json({ status: true, data: user });

  } catch (error) {
    res.status(500).json({ status: false, message: "Server error." });
    console.log(error);
  }
}

export const getAllUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const users = await User.find().select('-password');

    if (!users) {
      res.status(404).json({ status: false, message: "Users not found." });
      return;
    }

    res.status(200).json({ status: true, data: users });

  } catch (error) {
    res.status(500).json({ status: false, message: "Server error." });
    console.log(error);
  }
}

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: false, message: "All fields are required." });
    }

    const cleanEmail = cleanInputs(email);
    const cleanPassword = cleanInputs(password);

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401).json({ status: false, message: "Invalid password." });
      return;
    }

    const payload = {
      id: user._id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      role: user.role
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    if (!token) {
      res.status(404).json({ status: false, message: "No token provided" });
      return;
    }

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7
    });

    res.status(200).json({ status: true, message: "Login succesfully", token: token });
    return;

  } catch (error) {
    res.status(500).json({ status: false, message: "Server error." });
    console.log(error);
  }
}

export const logout = async (req: Request, res: Response): Promise<any> => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ status: false, message: "No token provided." });
    }

    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    return res.status(200).json({ status: true, message: "Logout successful." });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server error." });
  }
};


export const getSession = async (req: UserReq, res: Response): Promise<any> => {
  try {
    const user = await User.findById(req.user?.id);

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    res.status(200).json({
      status: true, message: "Has session", data: {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server error." });
  }
}
