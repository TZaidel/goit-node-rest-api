import express from 'express'
import { createUser, loginUser, getCurrentUser, logoutUser, updateAvatar, verifyEmail, resendVerifyEmail } from '../controllers/authControllers.js'

import { userSchema } from '../schemas/usersSchemas.js'

import validateBody from '../helpers/validateBody.js'
import upload from '../helpers/upload.js'
import authenticate from '../helpers/authenticate.js'

const authRouter = express.Router()

authRouter.get('/current', authenticate, getCurrentUser)

authRouter.post('/register', validateBody(userSchema), createUser)

authRouter.post('/login', validateBody(userSchema), loginUser)

authRouter.post('/logout', authenticate, logoutUser)

authRouter.patch('/avatars', authenticate, upload.single('avatar'), updateAvatar)

authRouter.get('/verify/:verificationToken', verifyEmail)

authRouter.post('/verify', validateBody(userSchema), resendVerifyEmail)


export default authRouter