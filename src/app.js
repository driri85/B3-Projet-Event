require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const UserDAO = require('./dao/dao_login_mock');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = process.env.PORT || 8080;
const dao = new UserDAO();
const { SECRET_JWT } = require('./core/config');
const cors = require('cors');

const allowedOrigins = [
  'https://arsdv.site',
  'https://frontend.arsdv.site',
  'http://192.168.1.50:8081',
];

// ✅ Always before any routes or body parsers
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('CORS blocked origin:', origin);
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
}));

app.options('*', cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
}));


app.use(bodyParser.json());



app.use(bodyParser.json());
const authRouter = require('./auth/auth-routes');
app.use('/login', authRouter);
const userRouter = require('./user/user-routes');
app.use('/users', userRouter);
const eventRouter = require('./event/event-routes');
const authenticateToken = require('./middleware/authenticateToken');
app.use('/events', authenticateToken, eventRouter);

// Route /me directe (protégée)
/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get current authenticated user's info (raw format)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 682c5494abcc4b5ec4f9bed1
 *                 email:
 *                   type: string
 *                   example: user@example.com
 *                 admin:
 *                   type: boolean
 *                   example: false
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Utilisateur non trouvé
 */
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/me', authenticateToken, async (req, res) => {
    const user = await dao.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json({ id : user._id,email: user.email, admin: user.admin });
});

/**
 * @swagger
 * /me2:
 *   get:
 *     summary: Get current authenticated user's info (wrapped format)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "200"
 *                 message:
 *                   type: string
 *                   example: Utilisateur trouvé
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: 682c5494abcc4b5ec4f9bed1
 *                         email:
 *                           type: string
 *                           example: user1@gmail.com
 *                         admin:
 *                           type: boolean
 *                           example: false
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "404"
 *                 message:
 *                   type: string
 *                   example: Utilisateur non trouvé
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: string
 *                       nullable: true
 *                       example: null
 */

app.get('/me2', authenticateToken, async (req, res) => {
    const user = await dao.findById(req.user.id);
    if (!user) {
        return res.json(buildAPIResponse("404", "Utilisateur non trouvé", { user: null }));
    }
    res.json(buildAPIResponse("200", "Utilisateur trouvé", { user: { id : user.id,email: user.email, admin: user.admin } }));
});

const connectDB = require('./core/mongodb'); // fichier de connexion
connectDB(); // Connecte à MongoDB

// SWAGGER CONFIG
const swaggerUI = require('swagger-ui-express');           // Import Swagger UI middleware
const swaggerSpec = require('./swagger');                  // Import your Swagger config

// Serve Swagger docs at http://localhost:3000/api-docs
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
