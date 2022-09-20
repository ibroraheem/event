const mongoose = require('mongoose');

const TicketTypeSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },

},
    { timestamps: true }
)

const TicketType = mongoose.model('TicketType', TicketTypeSchema)
module.exports = TicketType