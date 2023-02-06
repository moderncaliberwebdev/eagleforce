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

const mailTo = (firstname, lastname, email, phone, message, callback) => {
  //validation
  if (!firstname || !lastname || !email || !phone || !message) {
    return callback('Please fill in all fields', undefined)
  } else if (!validator.isEmail(email)) {
    return callback('Provide a valid email', undefined)
  } else {
    const output = `
                <h3>First Name: </h3> ${firstname}
                <h3>Last Name: </h3> ${lastname}
                <h3>Email: </h3> ${email}
                <h3>Phone Number: </h3> ${phone}
                <h3>Message: </h3> ${message}
            `
    const mailOptions = {
      // from: email,
      from: 'support@mg.eagleforceemploymentservices.com',
      to: 'support@eagleforceemploymentservices.com',
      subject: 'Eagle Force Support Team',
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
  const { firstname, lastname, email, phone, message } = req.query
  mailTo(firstname, lastname, email, phone, message, (err, data) => {
    res.send({
      firstname,
      lastname,
      email,
      phone,
      message,
      formResponse: err,
    })
  })
}
