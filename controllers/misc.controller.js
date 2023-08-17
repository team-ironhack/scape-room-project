const mongoose = require('mongoose');
const Room = require('../models/Room.model');
const Player = require('../models/Player.model')

module.exports.test = (req, res, next) => {
    res.redirect('/login')
}

module.exports.list = (req, res, next) => {

    const promises = [
        Room.find().limit(4).sort({ createdAt: 'descending' }),
        Player.find().limit(3).sort({ createdAt: 'descending' }),
    ]
    Promise.all(promises)
        .then(([salas, jugadores]) => {
            res.render('home', { lastRooms: salas, lastPlayers: jugadores })
        })
        .catch(next)
}