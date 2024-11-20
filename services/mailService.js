require('dotenv').config();
const { response } = require('express');
const nodeMailer = require("nodemailer");

module.exports = async ({ from, to, subject, text, html }) => {
    console.log(from, to, html);

    let transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    // send mail with defined transport object
    await transporter.sendMail({
        from: from,
        to: to,
        subject: subject,
        text: text,
        html: html,
    }, (error, emailResponse) => {
        if (error) throw error
        console.log("success!");
        response.end();
    });
}