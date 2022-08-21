const mongoose = require('mongoose');

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

},
    { timestamps: true }
)

const Ticket = mongoose.model('Ticket', TicketSchema)
module.exports = Ticket