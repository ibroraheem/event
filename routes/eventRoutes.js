const express = require('express');
const router = express.Router();

const {bookEvent, postEvent, getEvents, getEvent, deleteEvent} = require('../controllers/eventController')

router.post("/buy", bookEvent)
router.post("/create", postEvent)
router.get("/", getEvents)
router.get("/:eventId", getEvent)
router.delete("/:eventId", deleteEvent)

module.exports = router;