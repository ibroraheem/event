/*  */
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
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
                role: 'admin',
                confirmationCode: '',
                confirmed: true
            })
            await user.save()
            res.status(201).send({ message: 'Admin user created' })
        }
        const user = await User.findOne({ email })
        if (user) {
            res.status(400).send({ message: 'User already exists' })
        }
        const confirmationCode = jwt.sign({ email, username }, process.env.JWT_SECRET, { expiresIn: '1h' })
        const newUser = new User({
            email,
            username,
            password,
            role: 'organizer',
            confirmationCode: confirmationCode,
        })
        await newUser.save()
        res.status(201).send({ message: 'User created' })
        //Mailer Code goes here

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

/**
 * It takes a confirmation code from the URL, finds the user with that code, sets the user's confirmed
 * property to true, and then saves the user.
 * @param req - The request object.
 * @param res - The response object.
 */
const confirmUser = async (req, res) => {
    const { confirmationCode } = req.params
    try {
        const user = await User.findOne({ confirmationCode })
        if (!user) {
            return res.status(400).send({ message: 'User not found' })
        }
        user.confirmed = true
        user.confirmationCode = ''
        await user.save()
        res.status(200).send({ message: 'User confirmed' })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}


/**
 * It takes the email from the request body, finds the user in the database, creates a token, saves the
 * token to the database, sends an email with a link to the user, and returns a message to the client.
 * @param req - the request object
 * @param res - the response object
 * @returns The token is being returned.
 */
const forgotPassword = async (req, res) => {
    const { email } = req.body
    try {
        const user = await User.findOne({ email: email })
        if (!user) return res.status(401).json({ message: 'User not found' })
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' })
        user.passwordResetToken = token
        await user.save()
        const transporter = nodemailer.createTransport({
            host: 'smtp.zoho.eu',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        })
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Password Reset',
            html: `<p>Click <a href="http://localhost:3000/reset-password/${token}">here</a> to reset your password</p>`
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
            } else {
                console.log('Email sent: ' + info.response)
            }
        })
        res.status(200).json({ message: 'Email sent' })
    } catch (error) {
        res.status(050).json({ message: error.message })
    }
}

/**
 * It takes a password and a token from the request body and params, finds a user with the token,
 * hashes the password, sets the password and token to empty, and saves the user.
 * @param req - request
 * @param res - the response object
 * @returns The user's password is being reset.
 */
const resetPassword = async (req, res) => {
    const { password } = req.body
    const { token } = req.params.token
    try {
        const user = await User.findOne({ passwordResetToken: token })
        if (!user) return res.status(401).json({ message: 'User not found' })
        const hash = await bcrypt.hash(password, 10)
        user.password = hash
        user.passwordResetToken = ''
        await user.save()
        res.status(200).json({ message: 'Password reset' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


module.exports = { register, login, confirmUser, forgotPassword, resetPassword }
