const Like = require('../models/Like.model');

module.exports.create = (req, res, next) => {
    const playerId = req.params.playerId;
    const roomId = req.params.roomId;

    let likeNum = 
    

    Like.findOne({ player: playerId, room: roomId })
    .then(like => {
        if(like) {
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