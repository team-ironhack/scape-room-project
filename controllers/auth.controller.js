// registro
module.exports.registerPlayer = (req, res, next) => {
    res.render('auth/player-register')
}
module.exports.registerCompany = (req, res, next) => {
    res.render('auth/company-register')
}

//login
module.exports.login = (req, res, next) => {
    res.render('auth/login')
}