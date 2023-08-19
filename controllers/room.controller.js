const Room = require("../models/Room.model");
const Company = require("../models/Company.model");
const Comment = require ('../models/Comment.model')
const mongoose = require('mongoose');

// Mostrar formulario de crear sala
module.exports.createRoom = (req, res, next) => {
  res.render("room/room-form");
};

// Hacer el post de crear la sala
module.exports.doCreateRoom = (req, res, next) => {
  const renderWithErrors = (errors) => {
    res.render("room/room-form", {
      room: req.body,
      errors,
    });
  };

  const data = {
    ...req.body,
    company: req.user._id,
    image: req.file ? req.file.path : undefined,
  };

  console.log(req.body);

  Room.create(data)
    .then((room) => {
      console.log(`Sala ${room.name} creada.`);
      res.redirect(`/company/profile/${req.user._id}`);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        renderWithErrors(err.errors);
      } else {
        next(err);
      }
    });
};

// Mostrar vista detalle de la sala
module.exports.roomDetail = (req, res, next) => {
  const { id } = req.params;
  Room.findById(id)
    .populate("company")
    .then((room) => {
      Comment.find({ room: req.params.id })
      .populate("player")
      .then ((comment) => {
        res.render("room/room-detail", { room, comment });
      })
      
    })
    .catch((err) => {
      next(err);
    });
};

// Mostrar form para editar una sala
module.exports.editRoom = (req, res, next) => {
  const { id } = req.params;
  Room.findById(id)
    .then((room) => {
      res.render("room/room-form", { room, isEdit: true });
    })
    .catch((err) => {
      next(err);
    });
};

// Editar la sala
module.exports.doEditRoom = (req, res, next) => {

  const { id } = req.params;

  const renderWithErrors = (errors) => {
    res.render("room/room-form", {
      room: req.body,
      errors,
    });
  };

  console.log(req.body)
  
  Room.findByIdAndUpdate(id, req.body, { new: true })
    .then((room) => {
      console.log(`la sala ${room.name} ha sido editada`)
      res.redirect(`/room/${room.id}`);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        renderWithErrors(err.errors);
      } else {
        next(err);
      }
    });
};

// Eliminar una sala
module.exports.deleteRoom = (req, res, next) => {
  const { id } = req.params;
  Room.findByIdAndDelete(id)
    .then((room) => {
      console.log(`sala ${room.name} borrada`);
      res.redirect(`/company/profile/${req.user._id}`);
    })
    .catch((err) => {
      next(err);
    });
};
