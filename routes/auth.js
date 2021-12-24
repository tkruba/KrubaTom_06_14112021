const express = require('express')
const router = express.Router()

const authCtrl = require('../controllers/auth')

// Ajoute les requêtes HTTP
router.post('/signup', authCtrl.signup)
router.post('/login', authCtrl.login)

module.exports = router