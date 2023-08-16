const Player = require('../models/Player.model');
const Company = require('../models/Company.model');
const Room = require('../models/Room.model');

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