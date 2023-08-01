const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema = new Schema ({
    player: {
        type: mongoose.Types.ObjectId,
        ref: 'Player'
    },
    room: {
        type: mongoose.Types.ObjectId,
        ref: 'Room'
    }
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;