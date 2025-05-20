const express = require("express");
const router = express.Router();
const sendResponse = require("../utils/response");
const eventController = require("./event-controller");
const mockAuth = require("../middleware/mockAuth");
const isAdmin = require("../middleware/isAdmin");
const app = express();
const authenticateToken = require('../middleware/authenticateToken');
// Appliquer le middleware de simulation d'utilisateur connecté
router.use(authenticateToken);


// 📌 GET tous les événements (public)
router.get("/", async (request, response) => {
  const events = await eventController.getAllEvents();
  return response.json(events);
});

// 📌 GET un événement par ID (public)
router.get("/:id", async (request, response) => {
  const id = parseInt(request.params.id);
  const event = await eventController.getEventById(id);

  if (!event) {
    return response.status(404).json({ message: "Événement non trouvé" });
  }

  return response.json(event);
});

// 🔐 POST créer un événement (admin seulement)
router.post("/", isAdmin, async (request, response) => {
  const eventData = request.body;
  const newEvent = await eventController.createEvent(eventData);

  return response.status(201).json(newEvent);
});

// 🔐 PUT modifier un événement (admin seulement)
router.put("/:id", isAdmin, async (request, response) => {
  const id = parseInt(request.params.id);
  const updatedData = request.body;

  const updatedEvent = await eventController.updateEvent(id, updatedData);
  if (!updatedEvent) {
    return response.status(404).json({ message: "Événement non trouvé" });
  }

  return response.json(updatedEvent);
});

// 🔐 DELETE supprimer un événement (admin seulement)
router.delete("/:id", isAdmin, async (request, response) => {
  const id = parseInt(request.params.id);
  const deletedEvent = await eventController.deleteEvent(id);

  if (!deletedEvent) {
    return response.status(404).json({ message: "Événement non trouvé" });
  }

  return response.json(deletedEvent);
});

module.exports = router;