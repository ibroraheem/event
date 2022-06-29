const Event = require('../models/event')
const QRCode = require('qrcode');

const bookEvent = async (req, res) => {
    const {eventId, name, phone, email} = req.body
    try {
        const event = await Event.findById(eventId)
        if(!event) {
            return res.status(400).send({message: 'Event not found'})
        }
        const qrCode = await QRCode.toDataURL(`${name} ${phone} ${event.name} ${event.date} ${event.location} ${event.price}`)
        const newBooking = {
        qrCode
        }
        await Event.findByIdAndUpdate(eventId, {$push: {bookings: newBooking}})
        res.status(200).send({message: 'Booking successful'})
    } catch (error) {
        res.status(400).send({message: error.message})
    }
}
const postEvent = (req, res) => {
    const {name, date, description, location, price, image} = req.body
    const event = new Event({
        name,
        date,
        description,
        location,
        price,
        image
    })
    event.save()
    res.status(201).send({message: 'Event created'})
}
const getEvents = async (req, res) => {
    try {
        const events = await Event.find({})
        res.status(200).send(events)
    } catch (error) {
        res.status(400).send({message: error.message})
    }
}
const getEvent = async (req, res) => {
    const {eventId} = req.params
    try {
        const event = await Event.findById(eventId)
        if(!event) {
            return res.status(400).send({message: 'Event not found'})
        }
        res.status(200).send(event)
    } catch (error) {
        res.status(400).send({message: error.message})
    }
}
const deleteEvent = async (req, res) => {
    const {eventId} = req.params
    try {
        const event = await Event.findByIdAndDelete(eventId)
        if(!event) {
            return res.status(400).send({message: 'Event not found'})
        }
        res.status(200).send({message: 'Event deleted'})
    } catch (error) {
        res.status(400).send({message: error.message})
    }
}
const updateEvent = async (req, res) => {
    const {eventId} = req.params
    const {name, date, description, location, price, image} = req.body
    try {
        const event = await Event.findByIdAndUpdate(eventId, {name, date, description, location, price, image})
        if(!event) {
            return res.status(400).send({message: 'Event not found'})
        }
        res.status(200).send({message: 'Event updated'})
    } catch (error) {
        res.status(400).send({message: error.message})
    }
}
module.exports = {bookEvent, postEvent, getEvents, getEvent, deleteEvent, updateEvent}