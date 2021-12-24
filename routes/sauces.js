const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

const saucesCtrl = require('../controllers/sauces')

// Ajoute les requêtes HTTP
router.get('/', auth, saucesCtrl.getAllSauces)
router.get('/:id', auth, saucesCtrl.getSingleSauce)

router.post('/', auth, multer, saucesCtrl.addNewSauce)
router.post('/:id/like', auth, saucesCtrl.likeSauce)

router.put('/:id', auth, multer, saucesCtrl.editSauce)

router.delete('/:id', auth, saucesCtrl.removeSauce)

module.exports = router