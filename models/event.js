/* Importing the mongoose module. */
const mongoose = require('mongoose');

/* Creating a schema for the event model. */
const EventSchema = new mongoose.Schema({
    eventType: {
        type: String,
        required: true,
        enum: ['free', 'paid'],
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    banner: {
        type: String,
        required: true,
    },
    availableTickets: {
        type: Number,
        required: true,
    },
    price: [{ regular: Number, vip: Number }],
    eventDate: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    from: {
        type: String,
        required: true,
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    organizerName: {
        type: String,
        required: true,
    },
    
    eventDuration: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
},
    { timestamps: true }
)

/* Exporting the model to be used in other files. */
const Event = mongoose.model('Event', EventSchema)
module.exports = Event