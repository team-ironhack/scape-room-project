
const handlebars = require('handlebars');
const fs = require('fs');
const nodemailer = require('nodemailer');

const email = process.env.EMAIL_ACCOUNT;

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: email,
        pass: process.env.EMAIL_PASSWORD
    }
});

module.exports.sendValidationEmailPlayer = (user) => {
    const source = fs.readFileSync('misc/bienvenida.hbs', 'utf8');
    const template = handlebars.compile(source);

    const activationLink = `${process.env.APP_HOST}/player/${user.id}/activate`;

    const userData = {
        name: user.name // Usar el nombre del usuario real
    };

    const html = template({ activationLink, user: userData });

    transporter.sendMail({
        from: `Scape <${email}>`,
        to: user.email,
        subject: '¡Bienvenide a IronScapes!',
        html: html
    })
    .then(() => {
        console.log(`Email sent to ${user.id}`)
    })
    .catch(err => {
        console.error(err)
    })
};

module.exports.sendValidationEmailCompany = (user) => {
    const source = fs.readFileSync('misc/bienvenida.hbs', 'utf8');
    const template = handlebars.compile(source);

    const activationLink = `${process.env.APP_HOST}/player/${user.id}/activate`;

    const userData = {
        name: user.name // Usar el nombre del usuario real
    };

    const html = template({ activationLink, user: userData });

    transporter.sendMail({
        from: `Scape <${email}>`,
        to: user.email,
        subject: '¡Bienvenide a IronScapes!',
        html: html
    })
    .then(() => {
        console.log(`Email sent to ${user.id}`)
    })
    .catch(err => {
        console.error(err)
    })
};