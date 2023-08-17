const Room = require('../models/Room.model')

module.exports.roomDetail = (req, res, next) => {
    const { id } = req.params
    console.log('entro aqui')
    console.log(id)
    Room.findById(id)
    .then(room => {
        res.render('room/room-detail', { room })
    })
    .catch(err => {
        console.error(err)
    })
}