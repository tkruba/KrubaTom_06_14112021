const Sauces = require('../models/Sauces')
const fs = require('fs')

// Récupère toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauces.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }))
}

// Récupère la sauce demandée
exports.getSingleSauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }))
}

// Ajoute une nouvelle sauce
exports.addNewSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id
    const sauce = new Sauces({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce ajoutée' }))
        .catch(error => res.status(400).json({ error }))
}

// Gère les likes et dislikes des sauces
exports.likeSauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (!sauce) {
                res.status(404).json({
                    error: new Error('No such Sauce')
                })
            }
            switch (req.body.like) {
                case 0:
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        Sauces.updateOne({ _id: req.params.id },
                            { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } },
                            { safe: true, multi: false })
                            .then(() => res.status(200).json({ message: 'Vous ne likez plus cette Sauce' }))
                            .catch(error => res.status(400).json({ error }))
                    } else {
                        Sauces.updateOne({ _id: req.params.id },
                            { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } },
                            { safe: true, multi: false })
                            .then(() => res.status(200).json({ message: 'Vous ne dislikez plus cette Sauce' }))
                            .catch(error => res.status(400).json({ error }))
                    }
                    break;
                case 1:
                    Sauces.updateOne({ _id: req.params.id }, { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } })
                        .then(() => res.status(200).json({ message: 'Sauce likée' }))
                        .catch(error => res.status(400).json({ error }))
                    break;
                case -1:
                    Sauces.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId } })
                        .then(() => res.status(200).json({ message: 'Sauce dislikée' }))
                        .catch(error => res.status(400).json({ error }))
                    break;
                default:
                    res.status(400).json({ message: 'How did you do this ? Explain it to me' })
                    break;
            }
        })
}

// Gère l'edition d'une sauce existante
exports.editSauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (!sauce) {
                res.status(404).json({
                    error: new Error('No such Sauce')
                })
            }
            if (sauce.userId !== req.auth.userId) {
                res.status(403).json({
                    error: new Error('Unauthorized request')
                })
            }
            if (req.file) {
                const filename = sauce.imageUrl.split('/images/')[1]
                fs.unlink(`images/${filename}`, () => {
                    const sauceObject = req.file ? {
                        ...JSON.parse(req.body.sauce),
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    } : { ...req.body }
                    Sauces.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce modifiée' }))
                        .catch(error => res.status(400).json({ error }))
                })
            } else {
                const sauceObject = req.body
                Sauces.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce modifiée' }))
                    .catch(error => res.status(400).json({ error }))
            }
        })
}

// Supprime une sauce existante
exports.removeSauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (!sauce) {
                res.status(404).json({
                    error: new Error('No such Sauce')
                })
            }
            if (sauce.userId !== req.auth.userId) {
                res.status(403).json({
                    error: new Error('Unauthorized request')
                })
            }
            const filename = sauce.imageUrl.split('/images/')[1]
            fs.unlink(`images/${filename}`, () => {
                Sauces.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce suprimée' }))
                    .catch(error => res.status(400).json({ error }))
            })
        })
}

