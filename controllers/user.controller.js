const Player = require('../models/Player.model');
const Company = require('../models/Company.model');

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
    .then(company => {
        if (company) {
          res.render('user/company-profile', { company });
        } else {
          next(createError(404, 'Usuario no encontrado'))
        }
      })
      .catch(next)
  }

module.exports.createRoom = (req, res, next) => {
    res.render('room/room-form')
}