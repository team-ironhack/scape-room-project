const mongoose = require('mongoose');
const Room = require('../model/Room.model');
const Player = require('../model/Player.model');
const Company = require('../model/Company.model');
const Like = require('../model/Like.model');
const Mark = require('../model/Mark.model');
const Comment = require('../model/Comment.model');
const Done = require('../model/Done.model');


module.exports.index = (req, res, next) => {
  res.redirect('/login')
}

module.exports.puzzle = (req, res, next) => {
  const options = {
    maxAge: 10 * 365 * 24 * 60 * 60 * 1000, 
    httpOnly: true,
  };
  res.cookie('puzzle', 'true', options);
  res.render('onBoarding', { hiddenNav: true })
}

module.exports.doPuzzle = (req, res, next) => {

  const userInput = req.body.puzzle;

  if (userInput && (userInput.toLowerCase() === 'contraseña')) {
    res.redirect('/login');

  } else {
    res.render('onboarding', { hiddenNav: true }, { comment: { puzzle: userInput }, errors: { puzzle: 'Respuesta incorrecta' }});
  }
}

// LISTAR POR FILTROS EN LA HOME

module.exports.list = (req, res, next) => {

  const promises = [
    Room.aggregate([
      {
        $lookup: {
          from: 'likes', 
          localField: '_id',
          foreignField: 'room',
          as: 'likes',
        },
      },
      {
        $addFields: {
          likeCount: { $size: '$likes' },
        },
      },
      {
        $sort: { likeCount: -1 }, 
      },
      {
        $limit: 3, 
      },
    ]),
    Player.aggregate([
      {
        $lookup: {
          from: 'dones', 
          localField: '_id',
          foreignField: 'player',
          as: 'dones',
        },
      },
      {
        $addFields: {
          doneCount: { $size: '$dones' },
        },
      },
      {
        $sort: { doneCount: -1 }, 
      },
      {
        $limit: 3, 
      },
    ]),
    Room.find().populate("company").populate("likes").populate("marks").populate("dones").limit(3).sort({ createdAt: 'descending' }),
    Company.findOne({ city: req.user.city })
      .populate({
        path: 'rooms',
        options: {
          limit: 3,
          sort: { createdAt: 'desc' },
        },
        populate: ['company', 'likes', 'marks', 'dones'],
      })
      .exec(),
    Company.find()
      .populate({
        path: 'rooms',
        populate: ['likes', 'marks', 'dones'],
      })
      .limit(3).sort({ createdAt: 'descending' })
  ]
  Promise.all(promises)
    .then(([likedRooms, jugadores, añadidas, cityRoomsResult, empresas]) => {
      const roomIds = likedRooms.map(room => room._id);
      const cityRooms = cityRoomsResult ? cityRoomsResult.rooms : [];
      jugadores.forEach(jugador => {
        jugador.currentUser = req.user;
      });
      return Room.find({ _id: { $in: roomIds } })
        .populate('company likes marks dones')
        .then((populatedRooms) => {
          Like.find({ player: req.user._id })
            .then((likes) => {
              Mark.find({ player: req.user._id })
                .then((marks) => {
                  Done.find({ player: req.user._id })
                    .then((dones) => {
                      res.render('home', { 
                        mostLiked: populatedRooms,
                        lastPlayers: jugadores,
                        lastRooms: añadidas,
                        hasCity: cityRooms,
                        likes: likes,
                        marks: marks,
                        dones: dones,
                        lastCompanies: empresas })
                    });
                });
            });
        });
    })
    .catch(next);

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
        .populate('company likes marks dones')
        .then(rooms => {
          Like.find({ player: req.user._id })
            .then(likes => {
              Mark.find({ player: req.user._id })
                .then(marks => {
                  Done.find({ player: req.user._id })
                    .then(dones => {
                      const noResults = companies.length <= 0 && rooms.length <= 0
                      res.render('results', {
                        companies,
                        rooms,
                        search,
                        noResults,
                        likes,
                        marks,
                        dones
                      })
                    })

                })
            })
        })
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
    room: req.params.id,
  };
  console.log('****', data);
  Comment.create(data)
    .then((comment) => {
      console.log('Se ha creado el comentario');
      res.redirect(`/room/${data.room}`);
      console.log(comment);
      console.log('Se ha creado el comentario');
    })
    .catch((err) => {
      console.log(err)
      if (err instanceof mongoose.Error.ValidationError) {
        renderWithErrors(err.errors);
      } else {
        next(err);
      }
    });
};

// ELIMINAR COMENTARIO
module.exports.deleteComment = (req, res, next) => {
  const { id } = req.params
  Comment.findByIdAndDelete(id)
    .then(comment => {
      res.redirect(`/room/${comment.room}`);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        renderWithErrors(err.errors);
      } else {
        next(err);
      }
    })
}