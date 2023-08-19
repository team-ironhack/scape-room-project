const mongoose = require('mongoose');
const Room = require('../models/Room.model');
const Player = require('../models/Player.model');
const Company = require('../models/Company.model');
const Like = require('../models/Like.model');
const Mark = require('../models/Mark.model');

module.exports.test = (req, res, next) => {
  res.redirect('/login')
}

// LISTAR POR FILTROS EN LA HOME

module.exports.list = (req, res, next) => {

  const promises = [
    Room.find().populate("company").populate("likes").populate("marks").limit(4).sort({ createdAt: 'descending' }),
    Player.find().limit(3).sort({ createdAt: 'descending' }),
  ]
  Promise.all(promises)
    .then(([salas, jugadores]) => {
      Like.find({ player: req.user._id })
        .then((likes) => {
          Mark.find({ player: req.user._id })
            .then((marks) => {
              res.render('home', { lastRooms: salas, lastPlayers: jugadores, likes: likes, marks: marks })
            })
        })
    })
    .catch(next)

}

// BUSCADOR Y MOSTRAR RESULTADOS

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

// DAR Y QUITAR LIKE

module.exports.likeCreate = (req, res, next) => {
  const playerId = req.params.playerId;
  const roomId = req.params.roomId;

  Like.findOne({ player: playerId, room: roomId })
    .then(like => {
      if (like) {
        Like.findByIdAndDelete(like._id)
          .then(() => {
            res.send('DELETED')
            console.log('like borrado')
          })
          .catch(err => {
            next(err)
          })
      } else {
        const like = new Like({
          player: playerId,
          room: roomId
        });
        like
          .save()
          .then(() => {
            res.send('CREATED')
            console.log('like creado')
          })
          .catch(err => {
            next(err)
          })
      }
    })
    .catch(err => {
      next(err)
    })
}

// DAR Y QUITAR SAVE

module.exports.markCreate = (req, res, next) => {
  const playerId = req.params.playerId;
  const roomId = req.params.roomId;

  Mark.findOne({ player: playerId, room: roomId })
    .then(mark => {
      if (mark) {
        Mark.findByIdAndDelete(mark._id)
          .then(() => {
            res.send('DELETED')
            console.log('mark borrado')
          })
          .catch(err => {
            next(err)
          })
      } else {
        const mark = new Mark({
          player: playerId,
          room: roomId
        });
        mark
          .save()
          .then(() => {
            res.send('CREATED')
            console.log('mark creado')
          })
          .catch(err => {
            next(err)
          })
      }
    })
    .catch(err => {
      next(err)
    })
}