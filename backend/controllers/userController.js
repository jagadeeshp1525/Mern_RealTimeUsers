// controllers/userController.js
import User from '../models/User.js'

// Create user
export const createUser = async (req, res, io) => {
  try {
    const { name, email, role } = req.body
    if (!name || !email || !role) {
      return res.status(400).json({ message: 'All fields required' })
    }

    const user = new User({ name, email, role })
    await user.save()

    // Emit real-time event
    io.emit('userAdded', {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    })

    res.status(201).json({ user })
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Email already exists' })
    }
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// Get users
export const getUsers = async (req, res) => {
  try {
    const { q } = req.query
    const filter = {}
    if (q) {
      const regex = new RegExp(q, 'i')
      filter.$or = [{ name: regex }, { email: regex }, { role: regex }]
    }
    const users = await User.find(filter).sort({ createdAt: -1 }).limit(200)
    res.json({ users })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}
