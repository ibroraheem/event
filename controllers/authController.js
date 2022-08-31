/*  */
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
require('dotenv').config()

/**
 * If there are no users in the database, create a new user with the role of admin. If there are users
 * in the database, create a new user with the role of organizer.
 * @param req - request
 * @param res - the response object
 */
const register = async (req, res) => {
    const { email, username, password } = req.body
    try {
        const isFirstUser = await User.countDocuments() === 0
        if (isFirstUser) {
            const user = new User({
                email,
                username,
                password,
                role: 'admin'
            })
            await user.save()
            res.status(201).send({ message: 'Admin user created' })
        }
        const user = await User.findOne({ email })
        if (user) {
            res.status(400).send({ message: 'User already exists' })
        }
        const newUser = new User({
            email,
            username,
            password,
            role: 'organizer'
        })
        await newUser.save()
        res.status(201).send({ message: 'User created' })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}



        /**
         * It takes the email and password from the request body, finds the user in the database, compares the
         * password to the hashed password in the database, and if they match, it creates a token and sends it
         * back to the user.
         * @param req - The request object.
         * @param res - The response object.
         * @returns The token is being returned.
         */
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

