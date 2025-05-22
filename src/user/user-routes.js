const express = require('express');
const router = express.Router();
const UserDAO = require('../dao/dao_login_mock');
const dao = new UserDAO();
const authenticateToken = require('../middleware/authenticateToken');
const { buildAPIResponse } = require('../core/helpers-library');

router.use(authenticateToken); // Protect all routes below with JWT token

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and operations
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a list of users
 */
router.get('/', async (req, res) => {
    const users = await dao.findAll();
    res.json(buildAPIResponse("200", "Utilisateur trouvé", { users }));
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns the user
 *       404:
 *         description: User not found
 */
router.get('/:id', async (req, res) => {
    const user = await dao.findById(req.params.id);
    if (user) res.json(buildAPIResponse("200", "Utilisateur trouvé", { user }));
    else res.json(buildAPIResponse("404", "Utilisateur non trouvé", { user: null }));
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               admin:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User created
 */
router.post('/', async (req, res) => {
    const newUser = await dao.create(req.body);
    res.json(buildAPIResponse("200", "Nouvel utilisateur créé", { newUser }));
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update an existing user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               admin:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated
 *       404:
 *         description: User not found
 */
router.put('/:id', async (req, res) => {
    const updatedUser = await dao.update(req.params.id, req.body);
    if (updatedUser) res.json(buildAPIResponse("200", "Utilisateur trouvé et mis à jour", { updatedUser }));
    else res.json(buildAPIResponse("404", "Utilisateur non trouvé", { user: null }));
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.delete('/:id', async (req, res) => {
    const deletedUser = await dao.delete(req.params.id);
    if (deletedUser) res.json(buildAPIResponse("200", "Utilisateur trouvé et supprimé", { deletedUser }));
    else res.json(buildAPIResponse("404", "Utilisateur non trouvé", { user: null }));
});

module.exports = router;