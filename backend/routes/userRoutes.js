import express from 'express'
import { createUser, getUsers } from '../controllers/userController.js'

const userRoutes = io => {
  const router = express.Router()

  router.post('/', (req, res) => createUser(req, res, io))
  router.get('/', getUsers)

  return router
}

export default userRoutes
