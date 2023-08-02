const Player = require('../models/Player.model');
const Company = require('../models/Company.model');
const mongoose = require('mongoose');
const passport = require('passport');
const { sendValidationEmailPlayer, sendValidationEmailCompany } = require('../config/nodemailer.config')

const userRegister = function (userModel1, userModel2, req, res, next) {

    const { email, password, repeatPassword } = req.body
    console.log(req.body)

    const renderWithErrors = (errors, formType) => {

        if (req.body.name) {
            res.render('auth/player-register', {
                user: req.body,
                errors
            })
        } else {
            res.render('auth/company-register', {
                user: req.body,
                errors
            })
        }
    }

    if (password !== repeatPassword) {
        return renderWithErrors({
            repeatPassword: 'Las contraseñas deben coincidir.',
            password: 'Las contraseñas deben coincidir.',
        })
    }

    userModel1.findOne({ email })
        .then(user => {
            if (user) {
                renderWithErrors({ email: 'El correo ya está en uso.' }, res);
            } else {
                userModel2.findOne({ email })
                    .then(user => {
                        if (user) {
                            renderWithErrors({ email: 'El correo ya está en uso.' }, res);
                        } else {
                            const userData = {
                                ...req.body,
                                avatar: req.file ? req.file.path : undefined
                            };

                            return userModel1.create(userData)
                                .then((user) => {
                                    if (user.isCompany) {
                                        sendValidationEmailCompany(user)
                                        res.redirect('/login');
                                    } else {
                                        sendValidationEmailPlayer(user)
                                        res.redirect('/login');
                                    }
                                })
                                .catch(err => next(err));
                        }
                    })
                    .catch(err => next(err));
            }
        })
        .catch(err => {
            if (err instanceof mongoose.Error.ValidationError) {
                renderWithErrors(err.errors, res);
            } else {
                next(err);
            }
        });
};



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







