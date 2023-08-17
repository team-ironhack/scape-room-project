const { sendValidationEmailPlayer, sendValidationEmailCompany } = require('../config/nodemailer.config')
const mongoose = require('mongoose');
const passport = require('passport');

const userRegister = function (userModel1, userModel2, req, res, next) {

    const { email, password, repeatPassword } = req.body
    console.log(req.body)

    const renderWithErrors = (errors, formType) => {

        if (req.body.name) {
            res.render('auth/player-register', {
                user: req.body,
                errors,
                hiddenNav: true
            })
        } else {
            res.render('auth/company-register', {
                user: req.body,
                errors,
                hiddenNav: true
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
                            if (userData.isCompany) {
                               userData.locationData = JSON.parse(req.body.locationData)
                            }
                            return userModel1.create(userData)
                                .then((user) => {
                                    if (user.isCompany) {
                                        sendValidationEmailCompany(user)
                                        res.render('auth/mail-sent');
                                    } else {
                                        sendValidationEmailPlayer(user)
                                        res.render('auth/mail-sent');
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

module.exports = {
    userRegister,
}