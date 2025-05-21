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
/**
 * @swagger
 * /events:
 *   get:
 *     summary: Retrieve all events
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "200"
 *                 message:
 *                   type: string
 *                   example: "Événement trouvé"
 *                 data:
 *                   type: object
 *                   properties:
 *                     events:
 *                       type: array
 *                       items:
 *                         type: object
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
/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get an event by ID
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the event to retrieve
 *     responses:
 *       200:
 *         description: Event found
 *       404:
 *         description: Event not found
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
/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event (admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               date:
 *                 type: string
 *               location:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - title
 *               - date
 *               - location
 *     responses:
 *       200:
 *         description: Event created successfully
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
/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update an existing event (admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Fields to update
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       404:
 *         description: Event not found
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
/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete an event (admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       404:
 *         description: Event not found
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
 * @swagger
 * /events/{id}/register:
 *   post:
 *     summary: Register the authenticated user to an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the event to register for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "200"
 *                 message:
 *                   type: string
 *                   example: "Inscription réussie"
 *                 data:
 *                   type: object
 *                   properties:
 *                     updatedEvent:
 *                       type: object
 *       400:
 *         description: Already registered or event is full
 *       404:
 *         description: Event not found
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
 * @swagger
 * /events/{id}/unregister:
 *   post:
 *     summary: Unregister the authenticated user from an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the event to unregister from
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Unregistration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "200"
 *                 message:
 *                   type: string
 *                   example: "Désinscription réussie"
 *                 data:
 *                   type: object
 *                   properties:
 *                     updatedEvent:
 *                       type: object
 *       400:
 *         description: User not registered
 *       404:
 *         description: Event not found
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