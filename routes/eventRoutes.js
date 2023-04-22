/* Importing the express module. */

const express = require('express');
/* Creating a new router object. */
const router = express.Router();

/* Importing the functions from the eventController.js file. */
const {createEvent, getEvent, getEvents, updateEvent, deleteEvent, getMyEvents, bookEvent, getOrganizers, getOrganizer, getOrganizerEvents} = require('../controllers/eventController'); 

/* Creating a route for the user to access the page. */
router.post('/event', createEvent);
router.get('/events', getEvents);
router.get('/event/:id', getEvent);
router.patch('/event/:id', updateEvent);
router.delete('/event/:id', deleteEvent);
router.get('/my-events', getMyEvents);
router.post('/event/:id/book', bookEvent);
router.get('/admin/organizers', getOrganizers)
router.get('/admin/organizer/:id', getOrganizer)
router.get('/admin/organizer/:id/events', getOrganizerEvents)


/* Exporting the router object. */
module.exports = router; 