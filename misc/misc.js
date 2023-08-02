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

const doLoginStrategy = (req, res, next, strategy = 'local-auth') => {
    const passportController = passport.authenticate(strategy, (error, user, validations) => {
      if (error) {
        next(error)
      } else if (!user) {
        res.render('auth/login', {
          user: req.body,
          errors: validations
        })
      } else {
        req.login(user, error => {
          if (error) {
            next(error);
          } else {
            res.redirect('/profile')
          }
        });
      }
    })
  
    passportController(req, res, next);
  }


module.exports = {
    userRegister,
    doLoginStrategy
}