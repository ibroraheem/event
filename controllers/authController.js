const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const register = async (req, res) => {
    const isFirstAccount = countDocuments() === 0
    if (isFirstAccount) {
        const { username, email, password } = req.body
        try {
            const user = await User.findOne({ email })
            if (user.email === email) {
                return res.status(400).send({ message: 'Email already exists' })
            } else if (user.username === username) {
                return res.status(400).send({ message: 'Username already exists' })
            } else {
                const user = new User({
                    username,
                    email,
                    password
                })
                const salt = await bcrypt.genSalt(10)
                user.password = await bcrypt.hash(password, salt)
                await user.save()
                const payload = {
                    user: {
                        id: user.id,

                        role: user.role
                    }
                }
                jwt.sign(payload, process.env.SECRET_KEY, (err, token) => {
                    if (err) throw err
                    res.json({ token })
                })
            }
        } catch (error) {
            console.log(error)
        }
    } else {
        res.status(400).json({ msg: 'There is already an account' })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).send({ message: 'User not found' })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).send({ message: 'Invalid password' })
        }
        const payload = {
            id: user._id,
            role: user.role
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h'
        })
        res.status(200).send({ token })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

module.exports = { register, login }

