module.exports.playerProfile = (req, res, next) => {
    res.render('user/player-profile')
}

module.exports.companyProfile = (req, res, next) => {
    res.render('user/company-profile')
}

module.exports.createRoom = (req, res, next) => {
    res.render('room/room-form')
}