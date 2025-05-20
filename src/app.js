const express = require('express');
const bodyParser = require('body-parser');
const DAOMock = require('./dao/dao_login_mock');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;
const dao = new DAOMock();
const { SECRET_JWT } = require('./core/config');
app.use(bodyParser.json());
const authRouter = require('./auth/auth-routes');
app.use('/auth', authRouter);
const cors = require('cors');
app.use(cors());
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
// SWAGGER
// Init swagger middleware
//const swaggerUI = require('swagger-ui-express');
//const swaggerDocument = require('./swagger_output.json');
//app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Routes

//Pour s'authentifier:
//Sur Postman:
//allez sur http://localhost:3000/login en POST
//sur Body > raw: mettre les champs email et password:
// exemple:
//{"email": "user1@gmail.com", "password": "123456"}
//cliquer sur Send
//vous devriez avoir un token
// copier le token dans "Authorization"
///puis aller sur http://localhost:3000/users en GET
//vous devriez avoir la liste des utilisateurs



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

// Middleware d'authentification
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

// donne les information de tout les utilisateurs
app.get('/users', authenticateToken, async (req, res) => {
    const users = await dao.findAll();
    res.json(users);
});

// donne les information de l'utilisateur grace a l'id
app.get('/users/:id', authenticateToken, async (req, res) => {
    const user = await dao.findById(req.params.id);
    if (user) res.json(user);
    else res.status(404).json({ message: 'User not found' });
});

// crée un nouvel utilisateur
app.post('/users',authenticateToken, async (req, res) => {
    const newUser = await dao.create(req.body);
    res.status(201).json(newUser);
});

// met a jour les information de l'utilisateur grace a l'id
app.put('/users/:id',authenticateToken, async (req, res) => {
    const updatedUser = await dao.update(req.params.id, req.body);
    if (updatedUser) res.json(updatedUser);
    else res.status(404).json({ message: 'User not found' });
});

// supprime l'utilisateur grace a l'id
app.delete('/users/:id',authenticateToken, async (req, res) => {
    const deletedUser = await dao.delete(req.params.id);
    if (deletedUser) res.json(deletedUser);
    else res.status(404).json({ message: 'User not found' });
});

app.get('/me', authenticateToken, async (req, res) => {
    const user = await dao.findById(req.user.id); // Optionnel : recharger depuis DAO
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(user);
});
/*
const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
*/
app.listen(3000, () => {
    console.log("Le serveur a démarré");
});