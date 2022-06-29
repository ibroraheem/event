const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const register = async (req, res) =>{
    const {name, email, password} = req.body
    try {
        const user = await User.findOne({email})
        if(user) {
            return res.status(400).send({message: 'User already exists'})
        }
        const hashedPassword = await bcrypt.hash(password, 12)
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        })
        const savedUser = await newUser.save()
        res.status(201).send({message: 'User created successfully'})
    } catch (error) {
        res.status(400).send({message: error.message})
    }

}

const login = async (req, res) => {
    const {email, password} = req.body
    try {
        const user = await User.findOne({email})
        if(!user) {
            return res.status(400).send({message: 'User not found'})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
            return res.status(400).send({message: 'Invalid password'})
        }
        const payload = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h'
        })
        res.status(200).send({token})
    } catch (error) {
        res.status(400).send({message: error.message})
    }
}

module.exports = {register, login}

