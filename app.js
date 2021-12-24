const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config()
const path = require('path')

const app = express()

// Initie la connexion à la base de donnée mongodb
mongoose.connect('mongodb+srv://' + process.env.DB_USER + ':' + process.env.DB_PASSWORD + process.env.DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connexion à MongoDB réussie.'))
    .catch(() => console.log('Connexion à MongoDB échouée.'))


// Crée et initie les variables de routes
const authRoutes = require('./routes/auth')
const saucesRoutes = require('./routes/sauces')

// Définie les controlles d'accès pour les requetes du serveur
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    next()
})

// Ajoute l'utilisation des routes à l'application
app.use(bodyParser.json())

app.use('/api/auth', authRoutes)
app.use('/api/sauces', saucesRoutes)
app.use('/images', express.static(path.join(__dirname, 'images')))

module.exports = app