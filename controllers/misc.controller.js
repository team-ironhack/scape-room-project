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
    const { companyName, company, city } = req.query
    const criteria = {};
  
    if (companyName) {
      criteria.companyName = new RegExp(companyName, 'i')
    }
    if (company) {
      criteria.company = new RegExp(company, 'i')
    }
    if (city) {
        criteria.city = new RegExp(city, 'i')
      }
  
    Company.find(criteria)
      .populate('rooms')
      .then(companies =>
        res.render('results', {
            companies,
            companyName,
          company,
          city
        })
      ).catch(error => next(error));
  }