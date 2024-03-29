/* Importing the login and register functions from the authController.js file. */
/* Importing the express module. */
const express = require('express');
const router = express.Router()
const { login, register, confirmUser, forgotPassword, resetPassword, resendConfirmation, grantAccess, revokeAccess, logout } = require('../controllers/authController')


/* Importing the functions from the authController.js file. */
router.post('/login', login)
router.post('/register', register)
router.patch('/confirm-user', confirmUser)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.post('/resend-confirmation', resendConfirmation)
router.post('/admin/revoke-access', revokeAccess)
router.post('/admin/grant-access', grantAccess)
router.post('/logout', logout)


/* Exporting the router object. */
module.exports = router