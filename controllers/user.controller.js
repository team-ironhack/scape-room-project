const Player = require('../model/Player.model');
const Company = require('../model/Company.model');
const Room = require('../model/Room.model');
const Like = require('../model/Like.model');
const Mark = require('../model/Mark.model');
const Comment = require('../model/Comment.model');
const Done = require('../model/Done.model');
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
        { path: 'marks' },
        { path: 'comments' },
        { path: 'dones' },

      ]
    })
    .then(company => {
      if (company) {
        const roomsWithAverage = company.rooms.map(room => {
          const comments = room.comments;

          if (comments.length === 0) {
            return {
              ...room.toObject(),
              averageScore: 0
            };
          } else {
            const totalScore = comments.reduce((total, c) => total + c.score, 0);
            const averageScore = (totalScore / comments.length).toFixed(1);

            return {
              ...room.toObject(),
              averageScore
            };
          }

        });

        res.render('user/company-profile', { company, roomsWithAverage });
      } else {
        Player.findById(id)
          .then(player => {
            res.redirect(`/player/profile/${player.id}`)
          })
          .catch(err => {
            next(createError(404, 'Usuario no encontrado'))
            console.error(err)
          })
      }
    })
    .catch(next)
}


// Mostrar vista de detalle 
module.exports.companyDetail = (req, res, next) => {
  const { id } = req.params
  Company.findById(id)
    .populate({
      path: 'rooms',
      populate: [
        { path: 'likes' },
        { path: 'marks' },
        { path: 'dones' },
      ]
    })
    .then(company => {
      Like.find({ player: req.user._id })
        .then((likes) => {
          Mark.find({ player: req.user._id })
            .then((marks) => {
              Done.find({ player: req.user._id })
                .then((dones) => {
                  res.render('user/company-detail', { company, likes, marks, dones })
                })
            })
        })
    })
    .catch(next)

}

// Mostrar form para editar perfil
module.exports.editCompanyProfile = (req, res, next) => {
  const { id } = req.params
  
  Company.findById(id)
    .then((user) => {
      res.render('auth/company-register', { user, isEdit: true, hiddenNav: true })
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

  const data = {
    ...req.body,
    avatar: req.file ? req.file.path : undefined,
  };

  Company.findByIdAndUpdate(id, data, { new: true })
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
    .then(companies => {
      companies.forEach(company => {
        company.currentUser = req.user;
      });
      res.render('user/companies', { companies, isCurrentUser: true })
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
        Like.find({ player: id })

          .populate({
            path: 'room',
            populate: {
              path: 'company'
            }
          })
          .then(likes => {
            Mark.find({ player: id })
              .populate({
                path: 'room',
                populate: {
                  path: 'company'
                }
              })
              .then(marks => {
                Done.find({ player: id })
                  .populate({
                    path: 'room',
                    populate: {
                      path: 'company'
                    }
                  })
                  .then(dones => {
                    res.render('user/player-profile', { player, isCurrentUser: true, likes, marks, dones });
                  })
              })
          })
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
      Like.find({ player: id })
        .populate({
          path: 'room',
          populate: {
            path: 'company'
          }
        })
        .then(likes => {
          Like.find({ player: req.user._id })
            .populate('room')
            .then(userLikes => {
              Done.find({ player: id })
                .populate({
                  path: 'room',
                  populate: {
                    path: 'company'
                  }
                })
                .then(dones => {
                  Done.find({ player: req.user._id })
                    .populate('room')
                    .then(userDones => {
                      Mark.find({ player: req.user._id })
                      .populate('room')
                      .then(userMarks => {
                      res.render('user/player-detail', { player, isCurrentUser: true, likes, dones, userLikes, userDones, userMarks })
                    })
                })

            })
        })
        .catch(err => {
          console.error(err)
        })
    })
  })
}

// Mostrar form para editar perfil
module.exports.editPlayerProfile = (req, res, next) => {
        const { id } = req.params
        Player.findById(id)
          .then((user) => {
            res.render('auth/player-register', { user, isEdit: true, hiddenNav: true })
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

        const data = {
          ...req.body,
          avatar: req.file ? req.file.path : undefined,
        };

        Player.findByIdAndUpdate(id, data, { new: true })
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