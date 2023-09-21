const nodeMailer = require('nodemailer')

async function sendEmail ( options ){

    const tranporter = nodeMailer.createTransport({
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            password: process.env.SMTP_PASSWORD,
        }
    })

    const mailOptions = {
        from: "",
        to:  options.email,
        subject: options.subject,
        text : options.message,
    }

    await tranporter.sendMail(mailOptions)
}

module.exports = sendEmail