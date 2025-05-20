const express = require('express');
const router = express.Router();
const UserDAO = require('../dao/dao_login_mock');
const dao = new UserDAO();
const authenticateToken = require('../middleware/authenticateToken');

router.use(authenticateToken); // protège toutes les routes ci-dessous

router.get('/', async (req, res) => {
    const users = await dao.findAll();
    res.json(users);
});

router.get('/:id', async (req, res) => {
    const user = await dao.findById(req.params.id);
    if (user) res.json(user);
    else res.status(404).json({ message: 'User not found' });
});

router.post('/', async (req, res) => {
    const newUser = await dao.create(req.body);
    res.status(201).json(newUser);
});

router.put('/:id', async (req, res) => {
    const updatedUser = await dao.update(req.params.id, req.body);
    if (updatedUser) res.json(updatedUser);
    else res.status(404).json({ message: 'User not found' });
});

router.delete('/:id', async (req, res) => {
    const deletedUser = await dao.delete(req.params.id);
    if (deletedUser) res.json(deletedUser);
    else res.status(404).json({ message: 'User not found' });
});

router.get('/me', async (req, res) => {
    const user = await dao.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json({ email: user.email, admin: user.admin }); // Masque id & password
});

module.exports = router;
