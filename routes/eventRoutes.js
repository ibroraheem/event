/* Importing the express module. */

const express = require('express');
/* Creating a new router object. */
const router = express.Router();

/* Importing the functions from the eventController.js file. */
const {createEvent, getEvent, getEvents, updateEvent, deleteEvent, getMyEvents} = require('../controllers/eventController'); 

/* Creating a route for the user to access the page. */
router.post('/event', createEvent);
router.get('/event', getEvents);
router.get('/event/:id', getEvent);
router.patch('/event/:id', updateEvent);
router.delete('/event/:id', deleteEvent);
router.get('/my-events', getMyEvents);



/* Exporting the router object. */
module.exports = router;