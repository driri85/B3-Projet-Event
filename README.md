# B3 Projet Event - Backend

Ce projet Node.js constitue la partie backend d'une application de gestion d'événements. Il est basé sur Express.js et MongoDB avec Mongoose pour gérer les données.

## Table des matières

- [B3 Projet Event - Backend](#b3-projet-event---backend)
  - [Table des matières](#table-des-matières)
  - [Technologies utilisées](#technologies-utilisées)
  - [Structure du projet](#structure-du-projet)
  - [Installation](#installation)
  - [Variables d’environnement](#variables-denvironnement)
  - [Démarrage du serveur](#démarrage-du-serveur)
  - [Fonctionnalités principales](#fonctionnalités-principales)
  - [Routes API](#routes-api)
    - [Auth](#auth)
    - [Events](#events)
  - [Authentification](#authentification)
  - [Règles et gestion des rôles](#règles-et-gestion-des-rôles)
  - [Auteurs](#auteurs)

---

## Technologies utilisées

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- Dotenv

---

## Structure du projet

```
B3-Projet-Event/
├── src/
│   ├── auth/               # Connexion et inscription
│   ├── config/             # Connexion à MongoDB
│   ├── core/               # Helpers (ex: réponse API standardisée)
│   ├── dao/                # Accès aux données MongoDB (DAO)
│   ├── event/              # Routes liées aux événements
│   ├── middleware/         # Middlewares d’authentification et d’autorisation
│   └── models/             # Schémas Mongoose
├── .env
├── server.js
```

---

## Installation

1. Cloner le dépôt :
   ```bash
   git clone <repository-url>
   cd B3-Projet-Event
   ```

2. Installer les dépendances :
   ```bash
   npm install
   ```

---

## Variables d’environnement

Créer un fichier `.env` à la racine du projet avec les clés suivantes :

```
MONGODB_URI="mongodb+srv://<User>:<Password>@b3-projet-event.<clusterID>.mongodb.net/<BDDName>?retryWrites=true&w=majority&appName=B3-Projet-Event"
SUPER_ADMIN_EMAIL=<email>
```

---

## Démarrage du serveur

```bash
npm start
```

Le serveur démarre par défaut sur `http://localhost:3000`.

---

## Fonctionnalités principales

- Authentification JWT
- Inscription / Connexion
- Création, modification, suppression d'événements (admin uniquement)
- Inscription et désinscription d'un utilisateur à un événement
- Affichage des participants
- Gestion du nombre maximum de places
- Récupération des événements avec participants

---

## Routes API

### Auth

| Méthode | Route         | Description                  |
|---------|---------------|------------------------------|
| POST    | /auth/login   | Connexion                    |
| POST    | /auth/signup  | Inscription utilisateur      |

---

### Events

| Méthode | Route                     | Description                                  |
|---------|---------------------------|----------------------------------------------|
| GET     | /events                   | Liste de tous les événements                 |
| GET     | /events/:id               | Détails d’un événement                       |
| POST    | /events                   | Création d’un événement (admin uniquement)   |
| PUT     | /events/:id               | Mise à jour d’un événement (admin uniquement)|
| DELETE  | /events/:id               | Suppression d’un événement (admin uniquement)|
| POST    | /events/:id/register      | Inscription à un événement                   |
| POST    | /events/:id/unregister    | Désinscription d’un événement                |

---

## Authentification

L'authentification est basée sur des JWT. Après connexion ou inscription, un token est généré et devra être utilisé dans les requêtes suivantes via le header :

```
Authorization: Bearer <token>
```

---

## Règles et gestion des rôles

- Seul un utilisateur avec `role: "admin"` peut créer, modifier ou supprimer un événement.
- Un utilisateur peut s’inscrire à un événement uniquement si :
  - Il n’est pas déjà inscrit
  - Le nombre maximum de places n’est pas atteint
- Un utilisateur peut se désinscrire librement

---

## Auteurs

Projet réalisé dans le cadre de la 3ᵉ année B3 - Application de gestion d’événements.