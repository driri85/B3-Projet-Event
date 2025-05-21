require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const UserDAO = require('./dao/dao_login_mock');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;
const dao = new UserDAO();
const { SECRET_JWT } = require('./core/config');
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:5173', // autorise VITE
    credentials: true                // autorise les cookies/headers d'auth
}));
app.use(bodyParser.json());
const authRouter = require('./auth/auth-routes');
app.use('/login', authRouter);
const userRouter = require('./user/user-routes');
app.use('/users', userRouter);
const eventRouter = require('./event/event-routes');
const authenticateToken = require('./middleware/authenticateToken');
app.use('/events', authenticateToken, eventRouter);

// Route /me directe (protégée)
app.get('/me', authenticateToken, async (req, res) => {
    const user = await dao.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json({ email: user.email, admin: user.admin });
});

const connectDB = require('./core/mongodb'); // fichier de connexion
connectDB(); // Connecte à MongoDB

// SWAGGER
// Init swagger middleware
//const swaggerUI = require('swagger-ui-express');
//const swaggerDocument = require('./swagger_output.json');
//app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.listen(3000, () => {
    console.log("Le serveur a démarré");
});