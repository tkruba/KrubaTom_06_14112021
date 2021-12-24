const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


// Crée et initie le schema utilisateur pour la base de donnée mongo
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})

userSchema.plugin(uniqueValidator)

// Exporte le schema
module.exports = mongoose.model('User', userSchema)