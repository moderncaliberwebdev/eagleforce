import nodemailer from 'nodemailer'
import mailGun from 'nodemailer-mailgun-transport'
import validator from 'validator'

const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_API_DOMAIN,
  },
}

const transporter = nodemailer.createTransport(mailGun(auth))

const mailTo = (email, yourEmail, message, callback) => {
  //validation
  if (!email || !yourEmail || !message) {
    return callback('Please fill in all fields', undefined)
  } else if (!validator.isEmail(yourEmail)) {
    return callback('Provide a valid email', undefined)
  } else {
    const output = `
                <h3>My Email: </h3> ${yourEmail}
                <h3>Message: </h3> ${message}
            `
    const mailOptions = {
      from: yourEmail,
      to: email,
      subject: 'Eagle Force Employer Contact Request',
      html: output,
    }
    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        callback('Internal Error', undefined)
      } else {
        callback(undefined, data)
      }
    })
  }
}

export default function mail(req, res) {
  const { email, yourEmail, message } = req.body
  mailTo(email, yourEmail, message, (err, data) => {
    res.send({
      email,
      yourEmail,
      message,
      formResponse: err,
    })
  })
}
