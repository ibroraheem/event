/* Importing the login and register functions from the authController.js file. */
/* Importing the express module. */
const express = require('express');
const router = express.Router()
const { login, register, confirmUser } = require('../controllers/authController')


/* Importing the login and register functions from the authController.js file. */
router.post('/login', login)
router.post('/register', register)
router.patch('/confirm-user', confirmUser)
/* Exporting the router object. */
module.exports = router