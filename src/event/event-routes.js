const express = require("express");
const router = express.Router();
const EventDAO = require('../dao/dao_event_mock');
const dao = new EventDAO();
const isAdmin = require("../middleware/isAdmin");
const app = express();
const authenticateToken = require('../middleware/authenticateToken');
const { buildAPIResponse } = require('../core/helpers-library');

// Appliquer le middleware de simulation d'utilisateur connecté
router.use(authenticateToken);

/**
 * @function getAllEvents
 * @name GET /events
 * @description Retrieve all events.
 * @param {Object} req - Express req object
 * @param {Object} res - Express res object
 * @returns {Object[]} 200 - Array of event objects
 */
router.get("/", async (req, res) => {
  const events = await dao.findAll();
  return res.json(buildAPIResponse("200", "Événement trouvé", {events}));
});


app.get('/test', (req, res) => {
  res.json(buildAPIResponse("200", "Test event OK", {events}));
});

/**
 * @function getEventById
 * @name GET /events/:id
 * @description Retrieve a specific event by its ID.
 * @param {Object} req - Express req object
 * @param {Object} res - Express res object
 * @returns {Object} 200 - Event object
 * @returns {Object} 404 - Event not found
 */
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const event = await dao.findById(id);

  if (!event) {
    return res.json(buildAPIResponse("404", "Événement non trouvé", {event : null}));
    
  }

  return res.json(buildAPIResponse("200", "Événement trouvé", {event}));
});

/**
 * @function createEvent
 * @name POST /events
 * @description Create a new event.
 * @param {Object} req - Express req object
 * @param {Object} res - Express res object
 * @returns {Object} 201 - Newly created event object
 */
router.post("/", isAdmin, async (req, res) => {
  const eventData = req.body;
  const newEvent = await dao.create(eventData);

  return res.json(buildAPIResponse("200", "Événement créé", {newEvent}));
});

/**
 * @function updateEvent
 * @name PUT /events/:id
 * @description Update an existing event by its ID.
 * @param {Object} req - Express req object
 * @param {Object} res - Express res object
 * @returns {Object} 200 - Updated event object
 * @returns {Object} 404 - Event not found
 */
router.put("/:id", isAdmin, async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;

  const updatedEvent = await dao.update(id, updatedData);
  if (!updatedEvent) {
    return res.json(buildAPIResponse("404", "Événement non trouvé", {updatedEvent : null}));
  }

  return res.json(buildAPIResponse("200", "Événement mis a jour", {updatedEvent}));
});

/**
 * @function deleteEvent
 * @name DELETE /events/:id
 * @description Delete an event by its ID.
 * @param {Object} req - Express req object
 * @param {Object} res - Express res object
 * @returns {Object} 200 - Deleted event object
 * @returns {Object} 404 - Event not found
 */
router.delete("/:id", isAdmin, async (req, res) => {
  const id = req.params.id;
  const deletedEvent = await dao.delete(id);

  if (!deletedEvent) {
    return res.json(buildAPIResponse("404", "Événement non trouvé", {deletedEvent : null}));
  }

  return res.json(buildAPIResponse("200", "Événement supprimer", {deletedEvent}));
});

module.exports = router;