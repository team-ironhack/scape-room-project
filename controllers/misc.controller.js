const mongoose = require('mongoose');
const Room = require('../models/Room.model');
const Player = require('../models/Player.model');
const Company = require('../models/Company.model');
const Like = require('../models/Like.model');
const Mark = require('../models/Mark.model');
const Comment = require('../models/Comment.model');
const Done = require('../Models/Done.model');

module.exports.test = (req, res, next) => {
  res.redirect('/login')
}

// LISTAR POR FILTROS EN LA HOME

module.exports.list = (req, res, next) => {

  const promises = [
    Room.find().populate("company").populate("likes").populate("marks").populate("dones").limit(4).sort({ createdAt: 'descending' }),
    Player.find().limit(3).sort({ createdAt: 'descending' }),
  ]
  Promise.all(promises)
    .then(([salas, jugadores]) => {
      Like.find({ player: req.user._id })
        .then((likes) => {
          Mark.find({ player: req.user._id })
            .then((marks) => {
              Done.find({ player: req.user._id })
                .then((dones) => {
                  res.render('home', { lastRooms: salas, lastPlayers: jugadores, likes: likes, marks: marks, dones: dones})
                })
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

// PONER Y QUITAR DONE


module.exports.doneCreate = (req, res, next) => {
  const playerId = req.params.playerId;
  const roomId = req.params.roomId;

  Done.findOne({ player: playerId, room: roomId })
    .then(done => {
      if (done) {
        Done.findByIdAndDelete(done._id)
          .then(() => {
            res.send('DELETED')
            console.log('done borrado')
          })
          .catch(err => {
            next(err)
          })
      } else {
        const done = new Done({
          player: playerId,
          room: roomId
        });
        done
          .save()
          .then(() => {
            res.send('CREATED')
            console.log('done creado')
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

// MOSTRAR PARA COMENTAR

/*module.exports.comment = (req, res, next) => {
  res.render('room/room-detail')
}*/

// HACER COMENTARIO

module.exports.doComment = (req, res, next) => {
  const renderWithErrors = (errors) => {
    res.render("room/room-detail", {
      room: req.body,
      errors,
    });
  };

  const data = {
    ...req.body,
    player: req.user._id,
    date: new Date(),
    room: req.params.id
  }

  Comment.create(data)
  .then(comment => {
    /*return Player.findById(data.player)
    .then(player => {
      return Room.findById(data.room)
      .populate('company')
      .then(room => {*/
      res.redirect(`/room/${data.room}`);
      console.log(comment);
      console.log('Se ha creado el comentario');
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        renderWithErrors(err.errors);
      } else {
        next(err);
      }
    });
};