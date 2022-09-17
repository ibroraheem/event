/* Importing the mongoose library. */
const mongoose = require('mongoose')

/* Creating a schema for the User model. */
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'organizer'],
        default: 'organizer'
    },
    confirmationCode: {
        type: String,
        default: ''
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    passwordResetToken: {
        type: String,
        default: ''
    },
},
    { timestamps: true }
)

/* Exporting the User model to be used in other files. */
const User = new mongoose.model('User', UserSchema)

module.exports = User