const express = require('express');
const app = express();
app.use(express.json());

const authRouter = require('./auth/auth-routes');
app.use('/auth', authRouter);

app.listen(3000, () => {
    console.log("Le serveur a démarré");
});