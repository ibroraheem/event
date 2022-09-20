const Event = require('../models/event')
const User = require('../models/user')
const Ticket = require('../models/ticket')
const TicketType = require('../models/ticketType')
const jwt = require('jsonwebtoken')
const qrCode = require('qrcode')
const nodemailer = require('nodemailer')
require('dotenv').config()


const createEvent = async (req, res) => {
    const {token} = req.headers.authorization.split(' ')[1]
    const {name, date, description, location, venue, time, image,} = req.bodyParser
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)
        const event = await Event.create({
            name,
            createdBy: user._id,
            date,
            description,
            location,
            venue,
            time,
            image,
        })
        res.status(201).send({message: 'Event created', event})
    } catch (error) {
        res.status(400).send({message: error.message})
    }
}

const addPricing = async (req, res) => {
    const {token} = req.headers.authorization.split(' ')[1]
    const eventId = req.params.id
    const {name, price, capacity} = req.body
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)
        const event = await Event.findById(eventId)
        if (user._id.toString() !== event.createdBy.toString() || decoded.role !== 'admin') {
            res.status(400).send({message: 'You are not the creator of this event'})
        }
        const ticketType = await TicketType.create({
            name,
            price,
            capacity,
            event: eventId,
        })
        event.ticketType = ticketType._id
        await event.save()
        res.status(201).send({message: 'Ticket type added', ticketType})
    } catch (error) {
        res.status(400).send({message: error.message})
    }
}

const getEvents = async (req, res) => {
    try {
        const events = await Event.find()
        res.status(200).send({events})
    } catch (error) {
        res.status(400).send({message: error.message})
    }
}

const getEvent = async (req, res) => {
    const {eventId} = req.params
    try {
        const event = await Event.findById(eventId)
        res.status(200).send({event})
    } catch (error) {
        res.status(400).send({message: error.message})
    }
}

const getMyEvents = async (req, res) => {
    const {token} = req.headers.authorization.split(' ')[1]
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)
        const events = await Event.find({createdBy: user._id})
        res.status(200).send({events})
    } catch (error) {
        res.status(400).send({message: error.message})
    }
}

const updateEvent = async (req, res) => {
    const {token} = req.headers.authorization.split(' ')[1]
    const eventId = req.params.id
    const {name, date, description, location, venue, time, image} = req.body
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)
        const event = await Event.findById(eventId)
        if (user._id.toString() !== event.createdBy.toString() || decoded.role !== 'admin') {
            res.status(400).send({message: 'You are not the creator of this event'})
        }
        event.name = name
        event.date = date
        event.description = description
        event.location = location
        event.venue = venue
        event.time = time
        event.image = image
        await event.save()
        res.status(200).send({message: 'Event updated', event})
    } catch (error) {
        res.status(400).send({message: error.message})
    }
}

const updatePricing = async (req, res) => {
    const {token} = req.headers.authorization.split(' ')[1]
    const eventId = req.params.id
    const {name, price, capacity} = req.body
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)
        const event = await Event.findById(eventId)
        if (user._id.toString() !== event.createdBy.toString() || decoded.role !== 'admin') {
            res.status(400).send({message: 'You are not the creator of this event'})
        }
        const ticketType = await TicketType.findById(event.ticketType)
        ticketType.name = name
        ticketType.price = price
        ticketType.capacity = capacity
        await ticketType.save()
        event.ticketType = ticketType._id 
        await event.save()
        res.status(200).send({message: 'Ticket type updated', ticketType})
    } catch (error) {
        res.status(400).send({message: error.message})
    }
}

const deleteEvent = async (req, res) => {
    const {token} = req.headers.authorization.split(' ')[1]
    const eventId = req.params.id
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)
        const event = await Event.findById(eventId)
        if (user._id.toString() !== event.createdBy.toString() || decoded.role !== 'admin') {
            res.status(400).send({message: 'You are not the creator of this event'})
        }
        await event.remove()
        res.status(200).send({message: 'Event deleted'})
    } catch (error) {
        res.status(400).send({message: error.message})
    }
}

const bookEvent = async (req, res) => {
    const {token} = req.headers.authorization.split(' ')[1]
    const eventId = req.params.id
    const {ticketType, buyerEmail, buyerName, buyerPhone} = req.body
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)
        const event = await Event.findById(eventId)
        const ticketType = await TicketType.findById(ticketType)
        if (ticketType.capacity === 0) {
            res.status(400).send({message: 'Ticket type is sold out'})
        }
        const booking = await Ticket.create({
            event: eventId,
            ticketType,
            buyerEmail,
            buyerName,
            buyerPhone,
            user: user._id,
        })
        ticketType.capacity -= 1
        await ticketType.save()
        const QRCode = await QRCode.toDataURL(booking._id.toString(), booking.ticketType.name, booking.buyerName, booking.buyerEmail, booking.buyerPhone)
        booking.QRCode = QRCode
        await booking.save()
    const transporter = nodemailer.createTransport({
        host: 'smtp.zoho.eu',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    })
    const mailOptions = {
        from: process.env.EMAIL,
        to: booking.buyerEmail,
        subject: 'Ticket',
        html: `<h1>Hi ${booking.buyerName}</h1>
        <p>Thank you for booking a ticket for ${event.name} on ${event.date} at ${event.time}.</p>
        <p>Here is your Ticket:</p>
        <img src="${booking.QRCode}" alt="QR Code" />
        <p>See you there!</p>
        <p>Best regards,</p>
        <p>Ticket Bro</p>`,
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error)
        } else {
            console.log('Email sent: ' + info.response)
        }
    })
        res.status(201).send({message: 'Ticket booked', QRCode})

        } catch (error) {
        res.status(400).send({message: error.message})
    }
}

module.exports = {createEvent, deleteEvent, addPricing, updatePricing, getEvent, getMyEvents, getEvents, updateEvent}
