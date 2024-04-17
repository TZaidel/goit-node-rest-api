import express from 'express'
import { createUser, loginUser, getCurrentUser, logoutUser } from '../controllers/authControllers.js'

import { userSchema } from '../schemas/usersSchemas.js'

import validateBody from '../helpers/validateBody.js'

import authenticate from '../helpers/authenticate.js'

const authRouter = express.Router()

authRouter.post('/current', authenticate, getCurrentUser)

authRouter.post('/register', validateBody(userSchema), createUser)

authRouter.post('/login', validateBody(userSchema), loginUser)

authRouter.post('/logout', authenticate, logoutUser)

export default authRouter