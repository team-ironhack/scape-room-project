const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { PLAYERS, DIFFICULTY, TERROR } = require('../misc/enum')

const roomSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'El nombre de la sala es requerido']
        },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company"
        },
        players: {
            type: String,
            enum: PLAYERS,
            required: [true, 'El número de jugadores es requerido']
        },
        minAge: {
            type: Number,
            required: [true, 'La edad mínima es requerida']
        },
        price: {
            type: Number,
            required: [true, 'El precio es requerido']
        },
        difficulty: {
            type: String,
            enum: DIFFICULTY,
            required: [true, 'La dificultad es requerida']
        },
        duration: {
            type: Number,
            required: [true, 'La duración es requerida']
        },
        terrorLevel: {
            type: String,
            enum: TERROR,
            required: [true, 'El nivel de terror es requerido']
        },
        synopsis: {
            type: String,
            required: [true, 'La sinopsis es requerida']
        },
        image: {
            type: String,
            required: [true, 'La imagen es requerida']
        }
    },
    {
        timestamps: true,
        toObject: {
            virtuals: true
          },
        toJSON: {
            virtuals: true
          }
    });
    
    roomSchema.virtual("likes", {
        ref:"Like",
        localField: "_id",
        foreignField: "room",
        justOne: false,
    });

    roomSchema.virtual("marks", {
        ref:"Mark",
        localField: "_id",
        foreignField: "room",
        justOne: false,
    });

    roomSchema.virtual("comments", {
        ref:"Comment",
        localField: "_id",
        foreignField: "room",
        justOne: false,
    });

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;