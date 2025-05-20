const express = require('express');
const bodyParser = require('body-parser');
const DAOMock = require('./dao/dao_login_mock');
const jwt = require('jsonwebtoken');


const app = express();
const port = 3000;
const dao = new DAOMock();
const { SECRET_JWT } = require('./core/config');

app.use(bodyParser.json());

// Routes
app.get('/users', async (req, res) => {
    const users = await dao.findAll();
    res.json(users);
});

app.get('/users/:id', async (req, res) => {
    const user = await dao.findById(req.params.id);
    if (user) res.json(user);
    else res.status(404).json({ message: 'User not found' });
});

app.post('/users', async (req, res) => {
    const newUser = await dao.create(req.body);
    res.status(201).json(newUser);
});

app.put('/users/:id', async (req, res) => {
    const updatedUser = await dao.update(req.params.id, req.body);
    if (updatedUser) res.json(updatedUser);
    else res.status(404).json({ message: 'User not found' });
});

app.delete('/users/:id', async (req, res) => {
    const deletedUser = await dao.delete(req.params.id);
    if (deletedUser) res.json(deletedUser);
    else res.status(404).json({ message: 'User not found' });
});


// Authentification
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await dao.findByEmail(email);
    if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Email ou mot de passe invalide' });
    }

    // Création du token SANS expiration
    const token = jwt.sign(
        { id: user.id, email: user.email, admin: user.admin },
        SECRET_JWT
    );

    res.json({ token });
});


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Token requis' });

    jwt.verify(token, SECRET_JWT, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token invalide' });

        req.user = user; // Attache les infos utilisateur
        next();
    });
}

app.get('/users', authenticateToken, async (req, res) => {
    const users = await dao.findAll();
    res.json(users);
});




app.listen(port, () => {
    console.log(`API running at http://localhost:${port}`);
});
