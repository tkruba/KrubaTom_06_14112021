const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require("../models/user")
const PasswordValidator = require('password-validator')

// Gère l'enregistrement des utilisateurs
exports.signup = (req, res, next) => {

    var pwdSchema = new PasswordValidator();

    pwdSchema
        .is().min(6)
        .is().max(16)
        .has().uppercase()
        .has().lowercase()
        .has().digits(1)
        .has().not().spaces()

    if (!pwdSchema.validate(req.body.password)) {
        return res.status(406).json({ message: 'Sécurité du mot de passe non suffisante' })
    }
    bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        })
        user.save().then(() => {
            res.status(201).json({
                message: 'Utilisateur crée.'
            })
        }).catch(error => res.status(400).json({ error }))
    }).catch(error => res.status(500).json({ error }))
}

// Gère l'authentification des utilisateurs
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }).then(user => {
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé' })
        }
        bcrypt.compare(req.body.password, user.password).then(valid => {
            if (!valid) {
                return res.status(401).json({ error: 'Mot de passe incorrect' })
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign({ userId: user._id },
                    process.env.SECRET_TOKEN,
                    { expiresIn: '24h' })
            })
        }).catch(error => res.status(500).json({ error }))
    }).catch(error => res.status(500).json({ error }))
}