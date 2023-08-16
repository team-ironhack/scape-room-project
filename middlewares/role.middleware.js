module.exports.isPlayer = (req, res, next) => {
    if (req.user.name) {
        next()
    } else {
        res.redirect('/company/profile')
    }
}

module.exports.isCompany = (req, res, next) => {
    if (req.user.companyName) {
        next()
    } else {
        res.redirect('/player/profile')
    }
}