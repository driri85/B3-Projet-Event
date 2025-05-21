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
 * @description Retrieve all events with participant info
 */
router.get("/", async (req, res) => {
  const events = await dao.findAll();
  const userId = req.user.id;

  const enrichedEvents = events.map(event => {
    const isRegistered = event.participants.map(p => p.toString()).includes(userId);
    return {
      ...event.toObject(),
      participantsCount: event.participants.length,
      isRegistered
    };
  });

  return res.json(buildAPIResponse("200", "Liste des événements", { events: enrichedEvents }));
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
  const event = await dao.findById(id);

  if (!event) {
    return res.json(buildAPIResponse("404", "Événement non trouvé", { event: null }));
  }

  const isRegistered = event.participants.map(p => p.toString()).includes(req.user.id);

  return res.json(buildAPIResponse("200", "Événement trouvé", {
    event: {
      ...event.toObject(),
      participantsCount: event.participants.length,
      isRegistered
    }
  }));
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
  return res.json(buildAPIResponse("200", "Événement créé", { newEvent }));
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
    return res.json(buildAPIResponse("404", "Événement non trouvé", { updatedEvent: null }));
  }

  return res.json(buildAPIResponse("200", "Événement mis à jour", { updatedEvent }));
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
    return res.json(buildAPIResponse("404", "Événement non trouvé", { deletedEvent: null }));
  }

  return res.json(buildAPIResponse("200", "Événement supprimé", { deletedEvent }));
});

/**
 * @function registerUser
 * @name POST /events/:id/register
 */
router.post('/:id/register', async (req, res) => {
  const userId = req.user.id;
  const eventId = req.params.id;

  const event = await dao.findById(eventId);
  if (!event) {
    return res.json(buildAPIResponse("404", "Événement introuvable", {}));
  }

  if (event.participants.includes(userId)) {
    return res.json(buildAPIResponse("400", "Utilisateur déjà inscrit", {}));
  }

  if (event.participants.length >= event.capacity) {
    return res.json(buildAPIResponse("400", "Capacité maximale atteinte", {}));
  }

  const updatedEvent = await dao.registerUser(eventId, userId);
  return res.json(buildAPIResponse("200", "Inscription réussie", { updatedEvent }));
});

/**
 * @function unregisterUser
 * @name POST /events/:id/unregister
 */
router.post('/:id/unregister', async (req, res) => {
  const userId = req.user.id;
  const eventId = req.params.id;

  const event = await dao.findById(eventId);
  if (!event) {
    return res.json(buildAPIResponse("404", "Événement introuvable", {}));
  }

  const isRegistered = event.participants.includes(userId);
  if (!isRegistered) {
    return res.json(buildAPIResponse("400", "Utilisateur non inscrit", {}));
  }

  const updatedEvent = await dao.unregisterUser(eventId, userId);
  return res.json(buildAPIResponse("200", "Désinscription réussie", { updatedEvent }));
});

module.exports = router