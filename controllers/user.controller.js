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
          res.render('user/player-profile', { player, isCurrentUser: true });
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
          res.render('user/company-profile', { company});
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

