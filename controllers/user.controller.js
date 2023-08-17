const Player = require('../models/Player.model');
const Company = require('../models/Company.model');
const Room = require('../models/Room.model');
const mongoose = require('mongoose');
const createError = require('http-errors');
const { errorMonitor } = require('connect-mongo');


module.exports.playerProfile = (req, res, next) => {
    const id = req.params.id;
    Player.findById(id)
    .then(player => {
        if (player) {
          res.render('user/player-profile', { player });
        } else {
          Company.findById(id)
          .then(company => {
            res.redirect(`/company/profile/${company.id}`)
          })
          .catch(err => {
            next(createError(404, 'Usuario no encontrado'))
            console.err(err)
          })
        }
      })
    .catch(next)
  }

module.exports.companyProfile = (req, res, next) => {
    const id  = req.params.id;

    Company.findById(id)
    .populate("rooms")
    .then(company => {
     
        if (company) {
          res.render('user/company-profile', { company, isRowView: true });
        } else {
          Player.findById(id)
          .then(player => {
            res.redirect(`/player/profile/${player.id}`)
          })
          .catch(err => {
            next(createError(404, 'Usuario no encontrado'))
            console.err(err)
          })
        }
      })
      .catch(next)
  }

module.exports.createRoom = (req, res, next) => {
    res.render('room/room-form')
}

module.exports.doCreateRoom = (req, res, next) => {

  const renderWithErrors = (errors) => {
        res.render('room/room-form', {
            room: req.body,
            errors
        })
    } 

    const data = {
        ...req.body,
        company: req.user._id,
        image: req.file ? req.file.path : undefined
    }

    console.log(data)
    
    Room.create(data)
    .then(room => {
      console.log(`Sala ${room.name} creada.`)
      res.redirect(`/company/profile/${req.user._id}`)   
    })
    .catch(err => {
      if (err instanceof mongoose.Error.ValidationError) {
        renderWithErrors(err.errors);
      } else {
        next(err);
      }
      })
}