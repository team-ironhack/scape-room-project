const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PLAYER = ['2-4', '2-5', '2-6'];
const DIFFICULTY = ['Baja', 'Media', 'Alta'];
const TERROR = ["No", "Temor", "Miedo", "Horror", "Terror", "Pánico"]

const roomSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'El nombre de la sala es requerido']
        },
        players: {
            type: String,
            enum: PLAYER,
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
        },

    },
    {
        timestamps: true,
    }
);

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;