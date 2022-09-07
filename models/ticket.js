/* Importing the mongoose library. */
const mongoose = require('mongoose');

/* Creating a schema for the ticket model. */
const TicketSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    buyerEmail: {
        type: String,
        required: true
    },
    buyerName: {
        type: String,
        required: true
    },
    buyerPhone: {
        type: String,
        required: true
    },
    scanned: {
        type: Boolean,
        default: false
    },
    qrCode: {
        type: String,
        default: ''
    },
    numberOfTickets: {
        type: Number,
        required: true
    },
    ticketType: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }

},
    { timestamps: true }
)

/* Creating a model for the Ticket schema. */
const Ticket = mongoose.model('Ticket', TicketSchema)
/* Exporting the Ticket model. */
module.exports = Ticket