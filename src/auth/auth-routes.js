const express = require('express');
const router = express.Router();
const authService = require('./auth-service');

// Route POST /login
router.post('/', async (req, res) => {
    const loginRequest = { email: req.body.email, password: req.body.password };
    const responseAPI = await authService.auth(loginRequest);
    return res.json(responseAPI);
});

module.exports = router;
