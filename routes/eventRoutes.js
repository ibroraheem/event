/* Importing the express module. */

const express = require('express');
/* Creating a new router object. */
const router = express.Router();

/* Importing the functions from the eventController.js file. */
const {bookEvent, postEvent, getEvents, getEventHome, getEventOrg, getEvent, deleteEvent} = require('../controllers/eventController')

/* Creating a route for the user to access the page. */
router.post("/buy", bookEvent)
router.post("/create", postEvent)
router.get("/all-events", getEvents)
router.get("/:eventId", getEvent)
router.delete("/:eventId", deleteEvent)
router.get("/", getEventHome)
router.get("/my-events", getEventOrg)

/* Exporting the router object. */
module.exports = router;