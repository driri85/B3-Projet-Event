const express = require('express');
const router = express.Router();
const user = require('../models/user');
const jwt = require('jsonwebtoken');
const { SECRET_JWT } = require('../core/config');
const { buildAPIResponse } = require('../core/helpers-library');

// Route POST /login
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authenticate a user and return a JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user1@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Successfully authenticated user
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
 *                   example: "Authentifié(e) avec succès"
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       202:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "202"
 *                 message:
 *                   type: string
 *                   example: "email/mot de passe incorrect"
 *                 data:
 *                   type: object
 *                   nullable: true
 */
router.post('/', async (req, res) => {
    const loggeduser = await user.findOne({ email: req.body.email, password: req.body.password });
        if (!loggeduser) {
            return buildAPIResponse("202", " email/mot de passe incorrect", null);
        }
        const token = jwt.sign({ id: loggeduser._id, email: loggeduser.email, admin: loggeduser.admin },SECRET_JWT);
        return res.json(buildAPIResponse("200", "Authentifié(e) avec succès", {token}));
});
module.exports = router;