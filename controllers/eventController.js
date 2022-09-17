const Event = require('../models/event')
const User = require('../models/user')
const Ticket = require('../models/ticket')
const jwt = require('jsonwebtoken')
const qrCode = require('qrcode')
const nodemailer = require('nodemailer')
require('dotenv').config()

const createEvent = async (req, res) => {
    const { token } = req.headers.authorization.split(' ')[1]
    const { name, description, location, date, time, price, capacity } = req.body
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ username: decoded.username })
        if (user.role === 'organizer' || user.role === 'admin') {
            const event = new Event({
                name,
                description,
                location,
                date,
                time,
                price,
                capacity,
                organizer: user._id
            })
            await event.save()
            res.status(201).send({ message: 'Event created' })
        } else {
            res.status(401).send({ message: 'You do not have permission to create an event' })
        }
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

const getEvents = async (req, res) => {
    try {
        const events = await Event.find()
        res.status(200).send(events)
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

const getEvent = async (req, res) => {
    const { id } = req.params
    try {
        const event = await Event.findById(id)
        res.status(200).send(event)
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

const updateEvent = async (req, res) => {
    const { token } = req.headers.authorization.split(' ')[1]
    const { id } = req.params
    const { name, description, location, date, time, price, capacity } = req.body
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ username: decoded.username })
        if (user.role === 'organizer' || user.role === 'admin') {
            const event = await Event.findById(id)
            if (event.organizer.toString() === user._id.toString()) {
                await Event.findByIdAndUpdate(id, {
                    name,
                    description,
                    location,
                    date,
                    time,
                    price,
                    capacity
                })
                res.status(200).send({ message: 'Event updated' })
            } else {
                res.status(401).send({ message: 'You do not have permission to update this event' })
            }
        } else {
            res.status(401).send({ message: 'You do not have permission to update an event' })
        }
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

const deleteEvent = async (req, res) => {
    const { token } = req.headers.authorization.split(' ')[1]
    const { id } = req.params
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ username: decoded.username })
        if (user.role === 'organizer' || user.role === 'admin') {
            const event = await Event.findById(id)
            if (event.organizer.toString() === user._id.toString()) {
                await Event.findByIdAndDelete(id)
                res.status(200).send({ message: 'Event deleted' })
            } else {
                res.status(401).send({ message: 'You do not have permission to delete this event' })
            }
        } else {
            res.status(401).send({ message: 'You do not have permission to delete an event' })
        }
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

const getMyEvents = async (req, res) => {
    const { token } = req.headers.authorization.split(' ')[1]
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ username: decoded.username })
        const events = await Event.find({ organizer: user._id })
        res.status(200).json(events)
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

module.exports = {createEvent, getEvents, getEvent, updateEvent, deleteEvent, getMyEvents}

