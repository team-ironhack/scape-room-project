const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const markSchema = new Schema ({
    player: {
        type: mongoose.Types.ObjectId,
        ref: 'Player'
    },
    room: {
        type: mongoose.Types.ObjectId,
        ref: 'Room'
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

const Mark = mongoose.model('Mark', markSchema);

module.exports = Mark;