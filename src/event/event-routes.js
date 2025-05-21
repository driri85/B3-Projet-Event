const express = require("express");
const router = express.Router();
const sendResponse = require("../utils/response");
const EventDAO = require('../dao/dao_event_mock');
const dao = new EventDAO();
const isAdmin = require("../middleware/isAdmin");
const app = express();
const authenticateToken = require('../middleware/authenticateToken');
// Appliquer le middleware de simulation d'utilisateur connecté
router.use(authenticateToken);

/**
 * @function getAllEvents
 * @name GET /events
 * @description Retrieve all events.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object[]} 200 - Array of event objects
 */
router.get("/", async (request, response) => {
  const events = await dao.findAll();
  return response.json(events);
});

/**
 * @function getEventById
 * @name GET /events/:id
 * @description Retrieve a specific event by its ID.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} 200 - Event object
 * @returns {Object} 404 - Event not found
 */
router.get("/:id", async (request, response) => {
  const id = parseInt(request.params.id);
  const event = await dao.findById(id);

  if (!event) {
    return response.status(404).json({ message: "Événement non trouvé" });
  }

  return response.json(event);
});

/**
 * @function createEvent
 * @name POST /events
 * @description Create a new event.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} 201 - Newly created event object
 */
router.post("/", isAdmin, async (request, response) => {
  const eventData = request.body;
  const newEvent = await dao.create(eventData);

  return response.status(201).json(newEvent);
});

/**
 * @function updateEvent
 * @name PUT /events/:id
 * @description Update an existing event by its ID.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} 200 - Updated event object
 * @returns {Object} 404 - Event not found
 */
router.put("/:id", isAdmin, async (request, response) => {
  const id = request.params.id;
  const updatedData = request.body;

  const updatedEvent = await dao.update(id, updatedData);
  if (!updatedEvent) {
    return response.status(404).json({ message: "Événement non trouvé" });
  }

  return response.json(updatedEvent);
});

/**
 * @function deleteEvent
 * @name DELETE /events/:id
 * @description Delete an event by its ID.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} 200 - Deleted event object
 * @returns {Object} 404 - Event not found
 */
router.delete("/:id", isAdmin, async (request, response) => {
  const id = request.params.id;
  const deletedEvent = await dao.delete(id);

  if (!deletedEvent) {
    return response.status(404).json({ message: "Événement non trouvé" });
  }

  return response.json(deletedEvent);
});

module.exports = router;