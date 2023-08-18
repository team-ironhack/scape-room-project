const mongoose = require('mongoose');
const Room = require('../models/Room.model');
const Player = require('../models/Player.model');
const Company = require('../models/Company.model')

module.exports.test = (req, res, next) => {
    res.redirect('/login')
}

module.exports.list = (req, res, next) => {

    const promises = [
        Room.find().populate("company").limit(4).sort({ createdAt: 'descending' }),
        Player.find().limit(3).sort({ createdAt: 'descending' }),
    ]
    Promise.all(promises)
        .then(([salas, jugadores]) => {
            res.render('home', { lastRooms: salas, lastPlayers: jugadores })
        })
        .catch(next)
}

module.exports.results = (req, res, next) => {
    const { name, company, city } = req.query
    const criteria = {};
  
    if (name) {
      criteria.name = new RegExp(name, 'i')
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
          name,
          company,
          city
        })
      ).catch(error => next(error));
  }