const Event = require('../models/event')
const Ticket = require('../models/ticket')
const QRCode = require('qrcode');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const multer = require('multer')
const upload = multer({ dest: '../uploads/' })
upload.single('image')



const bookEvent = async (req, res) => {
    const { eventId, buyerEmail, buyerName, buyerPhone } = req.body
    try {
        const event = await Event.findById(eventId)
        if (!event) {
            return res.status(400).send({ message: 'Event not found' })
        }
        const ticket = new Ticket({
            eventId,
            buyerEmail,
            buyerName,
            buyerPhone
        }).then(() => {
            QRCode.toDataURL(ticket._id, function (err, url) {
                if (err) throw err
                ticket.qrCode = url
                ticket.save()
                res.status(201).send({ url, message: 'Ticket booked' })
            })

            //Mailer CODE goes here

        })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}
const postEvent = (req, res) => {
    const token = req.body.token || req.headers['x-access-token'] || req.query.token
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).send({ message: 'Unauthorized' })
            } else {
                const { name, description, date, location, price } = req.body
                const image = req.file.filename
                const newEvent = new Event({
                    name,
                    description,
                    date,
                    location,
                    price,
                    image,
                    createdBy: decoded.id
                })
                newEvent.save((err, event) => {
                    if (err) {
                        return res.status(400).send({ message: err.message })
                    }
                    return res.status(201).send({ event, message: 'Event created successfully' })
                })
            }
        })
    }
}
const getEvents = async (req, res) => {
    try {
        const events = await Event.find({})
        res.status(200).send(events)
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}
const getEvent = async (req, res) => {
    const { eventId } = req.params
    try {
        const event = await Event.findById(eventId)
        if (!event) {
            return res.status(400).send({ message: 'Event not found' })
        }
        res.status(200).send(event)
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}
const deleteEvent = async (req, res) => {
    const token = req.body.token || req.headers['x-access-token'] || req.query.token
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).send({ message: 'Unauthorized' })
            } else {
                const { eventId } = req.params
                try {
                    const event = Event.findById(eventId)
                    if (!event) {
                        return res.status(400).send({ message: 'Event not found' })
                    }
                    if (event.createdBy !== decoded.id) {
                        return res.status(401).send({ message: 'Unauthorized' })
                    } else {
                        Event.findByIdAndDelete(eventId)
                        res.status(200).send({ message: 'Event deleted successfully' })
                    }
                } catch (error) {
                    res.status(400).send({ message: error.message })
                }
            }
        })
    }
}

const updateEvent = async (req, res) => {
    const token = req.body.token || req.headers['x-access-token'] || req.query.token
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).send({ message: 'Unauthorized' })
            } else {
                const { eventId } = req.params
                const { name, description, date, location, price } = req.body
                try {
                    const event = Event.findById(eventId)
                    if (!event) {
                        return res.status(400).send({ message: 'Event not found' })
                    }
                    if (event.createdBy !== decoded.id) {
                        return res.status(401).send({ message: 'Unauthorized' })
                    } else {
                        Event.findByIdAndUpdate(eventId, {
                            name,
                            description,
                            date,
                            location,
                            price
                        })
                        res.status(200).send({ message: 'Event updated successfully' })
                    }
                } catch (error) {
                    res.status(400).send({ message: error.message })
                }
            }
        })
    }
}
module.exports = { bookEvent, postEvent, getEvents, getEvent, deleteEvent, updateEvent }