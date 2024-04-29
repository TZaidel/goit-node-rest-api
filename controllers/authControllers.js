import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import gravatar from 'gravatar'
import path from "path"
import { fileURLToPath } from 'url'
import fs from 'fs/promises'
import Jimp from 'jimp'
import {nanoid} from 'nanoid'

import { catchAsync } from '../helpers/catchAsync.js';
import HttpError from '../helpers/HttpError.js';
import {sendMail} from '../helpers/sendMail.js'
import { User } from '../models/userModel.js';

dotenv.config();

const { SECRET_KEY, BASE_URL } = process.env


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
  const verificationToken = nanoid()

  const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationToken });

  const verifyEmail = {
    from: 'randomnessrandom@meta.ua',
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click verify email</a>`,
  }

  await sendMail(verifyEmail)

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
    avatarUrl: newUser.avatarUrl
  });
});


export const verifyEmail = catchAsync(async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, 'Invalid or expired verification token');
  }
  if (user.verify) {
    throw HttpError(409, 'Email already verified');
  }
  await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: null });

  res.status(200).json({
    message: 'Email verification successful',
  });
});

export const resendVerifyEmail = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(400, 'missing required field email');
  }
  if (user.verify) {
    throw HttpError(400, 'Verification has already been passed');
  }
  const verifEmail = {
    to: email,
    subject: 'Verifay email',
    html: `<a target="_blank" href="${host_base_url}/users/verify/${user.verificationToken}">Click verifay email</a>`,
  };
  await sendEmail(verifEmail);
  res.json({
    message: 'Verify email send success',
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

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });
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
