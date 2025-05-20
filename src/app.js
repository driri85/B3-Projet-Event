require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const UserDAO = require('./dao/dao_login_mock');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;
const dao = new UserDAO();
const { SECRET_JWT } = require('./core/config');
app.use(bodyParser.json());
const authRouter = require('./auth/auth-routes');
app.use('/login', authRouter);
const userRouter = require('./user/user-routes');
app.use('/users', userRouter);
const eventRouter = require('./event/event-routes');
app.use('/events', eventRouter);
const authenticateToken = require('./middleware/authenticateToken');
app.use('/events', authenticateToken, eventRouter);
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:5173/', // autorise VITE
    credentials: true                // autorise les cookies/headers d'auth
}));
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