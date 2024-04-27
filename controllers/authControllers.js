import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import gravatar from 'gravatar'
import path from "path"
import { fileURLToPath } from 'url'
import fs from 'fs/promises'
import Jimp from 'jimp'

import { catchAsync } from '../helpers/catchAsync.js';
import HttpError from '../helpers/HttpError.js';
import { User } from '../models/userModel.js';

dotenv.config();

const secretKey = process.env.SECRET_KEY;


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const avatarsDir = path.join(__dirname, "../", "public", "avatars")


export const createUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw HttpError(409, 'Email already in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email)
  const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL });

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
    avatarUrl: newUser.avatarUrl
  });
});

export const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, 'Email or password invalid');
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, 'Email or password invalid');
  }
  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, secretKey, { expiresIn: '23h' });
  await User.findOneAndUpdate(user._id, { token });
  res.json({
    token,
    email: user.email,
    subscription: user.subscription,
  });
});

export const getCurrentUser = (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

export const logoutUser = catchAsync(async (req, res) => {
  const { _id } = req.user;
  await User.findOneAndUpdate(_id, { token: null });

  res.status(204).send();
});

export const updateAvatar = catchAsync(async (req, res) => {
  const { _id } = req.user
  const {path: tempUpload, originalname} = req.file
  const filename = `${_id}, _${originalname}`
  const resultUpload = path.join(avatarsDir, filename)

  await fs.rename(tempUpload, resultUpload)

   const image = await Jimp.read(resultUpload);
  await image.resize(250, 250).writeAsync(resultUpload);

  const avatarURL = path.join("avatars", filename)
  await User.findByIdAndUpdate(_id, { avatarURL })
  
  res.json({
    avatarURL
  })
})