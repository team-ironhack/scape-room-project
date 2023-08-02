module.exports.test = (req, res, next) => {
    res.redirect('/login')
}

module.exports.home = (req, res, next) => {
    res.render('home')
}