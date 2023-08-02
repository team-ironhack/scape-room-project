const Player = require('../models/Player.model');
const Company = require('../models/Company.model');
const mongoose = require('mongoose');
const passport = require('passport');
const { userRegister } = require('../misc/misc')

// registro player
module.exports.registerPlayer = (req, res, next) => {
    res.render('auth/player-register')
}
module.exports.doRegisterPlayer = (req, res, next) => {
    userRegister(Player, Company, req, res, next)
}

// registro company

module.exports.registerCompany = (req, res, next) => {
    res.render('auth/company-register')
}

module.exports.doRegisterCompany = (req, res, next) => {
    userRegister(Company, Player, req, res, next)
}

//activate
module.exports.activatePlayer = (req, res, next) => {
    Player.findByIdAndUpdate(req.params.id, { active: true })
        .then(() => {
            res.redirect('/login')
        })
}

module.exports.activateCompany = (req, res, next) => {
    Company.findByIdAndUpdate(req.params.id, {active: true})
    .then(() => {
        res.redirect('/login')
    })
}

//login
module.exports.login = (req, res, next) => {
    res.render('auth/login')
}

//module.exports.doLogin = 







