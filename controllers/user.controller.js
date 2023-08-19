const Player = require('../models/Player.model');
const Company = require('../models/Company.model');
const Room = require('../models/Room.model');
const mongoose = require('mongoose');
const createError = require('http-errors');
const { errorMonitor } = require('connect-mongo');

// COMPANY

// Mostrar perfil
module.exports.companyProfile = (req, res, next) => {
  const id = req.params.id;

  Company.findById(id)
    .populate({
      path: 'rooms',
      populate: [
        { path: 'likes' },
        { path: 'marks' }
      ]
    })
    .then(company => {

      if (company) {
        res.render('user/company-profile', { company });
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

// Mostrar vista de detalle 
module.exports.companyDetail = (req, res, next) => {
  const { id } = req.params
  Company.findById(id)
    .populate("rooms")
    .then(company => {
      res.render('user/company-detail', { company })
    })
    .catch(err => {
      console.error(err)
    })
}

// Mostrar form para editar perfil
module.exports.editCompanyProfile = (req, res, next) => {
  const { id } = req.params
  Company.findById(id)
    .then((user) => {
      res.render('auth/company-register', { user, isEdit: true })
    })
    .catch(err => {
      console.error(err)
    })
}

// Editar perfil
module.exports.doEditCompanyProfile = (req, res, next) => {

  const renderWithErrors = (errors) => {
    res.render('auth/company-register', {
      user: req.body,
      errors,
    });
  };

  const { id } = req.params

  Company.findByIdAndUpdate(id, req.body, { new: true })
    .then(user => {
      console.log(`el usuario empresa ${user.name} se actualizó`)
      res.redirect(`/company/profile/${user.id}`)
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        renderWithErrors(err.errors);
      } else {
        next(err);
      }
    });
}

// Mostrar todas las empresas
module.exports.showCompanies = (req, res, next) => {
  Company.find()
  .then(company => {
    res.render('user/companies', { company })
  })
  .catch(err => {
    next(err)
  })
}

// PLAYER

// Mostrar perfil
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

// Mostrar vista de detalle
module.exports.playerDetail = (req, res, next) => {
  const { id } = req.params
  Player.findById(id)
    .then(player => {
      res.render('user/player-detail', { player })
    })
    .catch(err => {
      console.error(err)
    })
}

// Mostrar form para editar perfil
module.exports.editPlayerProfile = (req, res, next) => {
  const { id } = req.params
  Player.findById(id)
    .then((user) => {
      res.render('auth/player-register', { user, isEdit: true })
    })
    .catch(err => {
      console.error(err)
    })
}

// Editar perfil
module.exports.doEditPlayerProfile = (req, res, next) => {

  const renderWithErrors = (errors) => {
    res.render('auth/player-register', {
      user: req.body,
      errors,
    });
  };

  const { id } = req.params

  Player.findByIdAndUpdate(id, req.body, { new: true })
    .then(user => {
      console.log(`el usuario jugador ${user.name} se actualizó`)
      res.redirect(`/player/profile/${user.id}`)
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        renderWithErrors(err.errors);
      } else {
        next(err);
      }
    });
}