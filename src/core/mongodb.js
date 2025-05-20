const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connexion MongoDB réussie');
  } catch (err) {
    console.error('❌ Erreur de connexion MongoDB :', err);
    process.exit(1);
  }
};

module.exports = connectDB;
