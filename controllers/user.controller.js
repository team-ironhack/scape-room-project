const Player = require('../models/Player.model');
const Company = require('../models/Company.model');
const Room = require('../models/Room.model');
const mongoose = require('mongoose');
const { errorMonitor } = require('connect-mongo');

module.exports.playerProfile = (req, res, next) => {
    const id = req.params.id;
    Player.findById(id)
    .then(player => {
        if (player) {
          res.render('user/player-profile', { player });
        } else {
          next(createError(404, 'Usuario no encontrado'))
        }
      })
      .catch(next)
  }

module.exports.companyProfile = (req, res, next) => {
    const id  = req.params.id;

    Company.findById(id)
    .populate("rooms")
    .then(company => {
      console.log(company.rooms)
        if (company) {
          res.render('user/company-profile', { company, isRowView: true });
        } else {
          next(createError(404, 'Usuario no encontrado'))
        }
      })
      .catch(next)
  }

module.exports.createRoom = (req, res, next) => {
    res.render('room/room-form')
}

module.exports.doCreateRoom = (req, res, next) => {

    const data = {
        ...req.body,
        company: req.user._id,
        image: req.file ? req.file.path : undefined
    }
    
    Room.create(data)
    .then(room => {
        res.redirect(`/profile/company/${req.user._id}`)
        console.log(`Sala ${room.name} creada.`)
    })
    .catch(err => {
      console.log(err)
      })
}