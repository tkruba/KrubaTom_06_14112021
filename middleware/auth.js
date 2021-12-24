const jwt = require('jsonwebtoken')

// Génère un token de connexion unique
// et vérifie que l'utilisateur = celui du token
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN)
        const userId = decodedToken.userId
        req.auth = { userId }
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID'
        } else {
            next()
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request.')
        })
    }
}