const express = require('express');
const router = express.Router();
const authService = require('./auth-service');

router.get("/", async (request, response) => {
    const resultMetier = await authService.auth();
    return response.json(resultMetier);
});


// Exporter le router
module.exports = router;