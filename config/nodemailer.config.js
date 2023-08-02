const nodemailer = require('nodemailer');

const email = process.env.EMAIL_ACCOUNT;

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: email,
        pass: process.env.EMAIL_PASSWORD
    }
});

module.exports.sendValidationEmail = (user) => {
    transporter.sendMail({
        from: `Scape <${email}>`,
        to: user.email,
        subject: 'Prueba',
        html: `
        <h1>Scape prueba</h1>

        <p>Activa tu cuenta</p>

        <a href="${process.env.APP_HOST}/users/${user.id}/activate">Click here</a>
      `
    })
    .then(() => {
        console.log(`Email sent to ${user.id}`)
    })
    .catch(err => {
        console.error(err)
    })
};