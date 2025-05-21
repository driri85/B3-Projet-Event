const express = require('express');
const router = express.Router();
const user = require('../models/user');
const jwt = require('jsonwebtoken');
const { SECRET_JWT } = require('../core/config');
const { buildAPIResponse } = require('../core/helpers-library');

// Route POST /login
router.post('/', async (req, res) => {
    const loggeduser = await user.findOne({ email: req.body.email, password: req.body.password });
        if (!loggeduser) {
            return buildAPIResponse("202", " email/mot de passe incorrect", null);
        }
        const token = jwt.sign({ id: loggeduser._id, email: loggeduser.email, admin: loggeduser.admin },SECRET_JWT);
        return res.json(buildAPIResponse("200", "Authentifié(e) avec succès", {token}));
});
module.exports = router;