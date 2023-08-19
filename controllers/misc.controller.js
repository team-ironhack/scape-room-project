const mongoose = require('mongoose');
const Room = require('../models/Room.model');
const Player = require('../models/Player.model');
const Company = require('../models/Company.model');
const Like = require('../models/Like.model');

module.exports.test = (req, res, next) => {
  res.redirect('/login')
}

module.exports.list = (req, res, next) => {

    const promises = [
        Room.find().populate("company").populate("likes").limit(4).sort({ createdAt: 'descending' }),
        Player.find().limit(3).sort({ createdAt: 'descending' }),
    ]
    Promise.all(promises)
        .then(([salas, jugadores]) => {
          Like.find({ player: req.user._id })
          .then((likes) => {
            res.render('home', { lastRooms: salas, lastPlayers: jugadores, likes: likes })
          })
        })
        .catch(next)

}

module.exports.results = (req, res, next) => {
  const { search } = req.query
  const companyCriteria = {
    $or: [
      { 'city': new RegExp(search, 'i') },
      { 'companyName': new RegExp(search, 'i') },
      { 'province': new RegExp(search, 'i') },
    ]
  };

  const roomCriteria = {
    'name': new RegExp(search, 'i'),
  };

  Company.find(companyCriteria)
    .populate('rooms')
    .then(companies =>
      Room.find(roomCriteria)
        .populate('company')
        .then(rooms =>
          res.render('results', {
            companies,
            rooms,
            search
          })
        )
        .catch(error => next(error))
    )
    .catch(error => next(error));
}