const Player = require('../model/Player.model');
const Company = require('../model/Company.model');
const mongoose = require('mongoose');
const passport = require('passport');
const { userRegister } = require('../misc/misc')

// registro player
module.exports.registerPlayer = (req, res, next) => {
    res.render('auth/player-register',{ hiddenNav: true })
}
module.exports.doRegisterPlayer = (req, res, next) => {
    userRegister(Player, Company, req, res, next)
}

// registro company

module.exports.registerCompany = (req, res, next) => {
    res.render('auth/company-register', { hiddenNav: true })
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
    res.render('auth/login', { hiddenNav: true })
}

const doLoginStrategy = (req, res, next, strategy = `local-auth-${req.query.type}`) => {
    console.log(req.query)
    const passportController = passport.authenticate(strategy, (error, user, validations) => {
      if (error) {
        next(error)
      } else if (!user) {
        res.render('auth/login', {
          user: req.body,
          errors: validations,
          hiddenNav: true 
        })
      } else {
        req.login(user, error => {
          if (error) {
            next(error);
          } else {
            if(user.isCompany){
                res.redirect(`/company/profile/${user.id}`)
            } else {
                res.redirect(`/player/profile/${user.id}`)
            }    
          }
        });
      }
    })
  
    passportController(req, res, next);
  }

module.exports.doLogin = (req, res, next) => {
    doLoginStrategy(req, res, next);
}

module.exports.doLoginGoogle = (req, res, next) => {
    doLoginStrategy(req, res, next, 'google-auth');
}

module.exports.loginGoogle = (req, res, next) => {
    const passportController = passport.authenticate('google-auth', {
        scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
        prompt: 'select_account'
      });
    
      passportController(req, res, next);
}

//logout
module.exports.logout = (req, res, next) => {
    req.session.destroy();
    res.redirect('/login');
}






