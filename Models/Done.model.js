const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doneSchema = new Schema ({
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
});;

const Done = mongoose.model('Done', doneSchema);

module.exports = Done;