const User = require('./user-model');
const jwt = require('jsonwebtoken');
const { SECRET_JWT } = require('../core/config');
//const { buildAPIResponse } = require('../core/helpers-library');

module.exports = {

    auth: async (loginRequest) => {

        // Trouver en base l'user 
        const loggedUser = await User.findOne({ email: loginRequest.email, password: loginRequest.password });

        // Si pas trouvé
        if (!loggedUser) {
            
            return buildAPIResponse("202", " email/mot de passe incorrect", null);
        }

        const token = jwt.sign({ email: loggedUser.email }, SECRET_JWT, { expiresIn: '2 hours' });

        return buildAPIResponse("200", "Authentifié(e) avec succès", token);
    }

}