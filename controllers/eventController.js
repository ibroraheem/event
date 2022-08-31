/* Importing the required modules. */
const Event = require('../models/event')
const Ticket = require('../models/ticket')
const QRCode = require('qrcode');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const multer = require('multer')
const upload = multer({ dest: '../uploads/' })
upload.single('image')



/**
 * It takes in the eventId, buyerEmail, buyerName, buyerPhone, numberOfTickets and price from the
 * request body, finds the event by the eventId, creates a new ticket with the data from the request
 * body and the eventId, generates a QR code with the ticketId and numberOfTickets, saves the ticket
 * and sends the QR code and a message to the client.
 * </code>
 * @param req - {
 * @param res - the response object
 * @returns The ticket object is being returned.
 */
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
            buyerPhone,
            numberOfTickets,
            price
        }).then(() => {
            QRCode.toDataURL(`${ticket._id} \n Number of tickets: ${numberOfTickets}`, function (err, url) {
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
/**
 * It creates a new event and saves it to the database
 * @param req - request
 * @param res - the response object
 */
const postEvent = (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(401).send({ message: 'Unauthorized' })
                } else {
                    if (decoded.role === 'admin' || decoded.role === 'organizer') {
                        const { name, description, date, location, price } = req.body
                        const image = req.file.filename
                        const newEvent = new Event({
                            name,
                            description,
                            date,
                            location,
                            numberOfTickets,
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
                }
            })
        }
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}
/**
 * It gets all the events from the database and sends them to the admin.
 * @param req - request
 * @param res - the response object
 */
const getEvents = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const ifAdmin = decoded.role
        if (ifAdmin === 'admin') {
            const events = await Event.find({})
            res.status(200).send(events)
        }
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}
/**
 * It checks if the user is an organizer, if so, it returns all the events created by that user.
 * @param req - request
 * @param res - the response object
 */
const getEventOrg = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const ifOrg = decoded.role
        if (ifOrg === 'organizer') {
            const events = await Event.find({ createdBy: decoded.id })
            res.status(200).send(events)
        }

    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}



/**
 * It gets the first 6 events from the database and sends them to the client.
 * @param req - The request object represents the HTTP request and has properties for the request query
 * string, parameters, body, HTTP headers, and so on.
 * @param res - the response object
 */
const getEventHome = async (req, res) => {
    try {
        const events = await Event.find({}).sort({ 'date': 1 }).limit(6)
        res.status(200).send(events)
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}
/**
 * It takes an eventId from the request params, finds the event in the database, and sends the event
 * back to the client.
 * @param req - The request object. This object represents the HTTP request and has properties for the
 * request query string, parameters, body, HTTP headers, and so on.
 * @param res - the response object
 * @returns The event object
 */
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
/**
 * It deletes an event from the database if the user is an admin.
 * @param req - request
 * @param res - the response object
 * @returns The event is being deleted from the database.
 */

const deleteEvent = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const ifAdmin = decoded.role
    if (ifAdmin === 'admin') {
        const { eventId } = req.params
        try {
            const event = await Event.findById(eventId)
            if (!event) {
                return res.status(400).send({ message: 'Event not found' })
            }
            event.remove()
            res.status(200).send({ message: 'Event deleted successfully' })
        } catch (error) {
            res.status(400).send({ message: error.message })
        }
    }
}


/**
 * It updates an event if the user is the creator of the event or if the user is an admin.
 * </code>
 * @param req - request object
 * @param res - the response object
 */
const updateEvent = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    if (!token) return res.status(400).send({ message: 'You have no access' })
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
                if (event.createdBy !== decoded.id || decoded.role === 'admin') {
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

module.exports = { bookEvent, postEvent, getEvents, getEvent, getEventHome, getEventOrg, deleteEvent, updateEvent }