/* Importing the mongoose module. */
const mongoose = require('mongoose');

/* Creating a schema for the event model. */
const EventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    price: {
        type: Array,
        required: true
    },
    image: {
        type: String,
        required: true
    },
},
    { timestamps: true }
)

/* Exporting the model to be used in other files. */
const Event = mongoose.model('Event', EventSchema)
module.exports = Event