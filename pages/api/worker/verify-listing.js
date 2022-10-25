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

const mailTo = (fullName, email, message, callback) => {
  //validation
  if (!fullName || !email || !message) {
    return callback('Please fill in all fields', undefined)
  } else if (!validator.isEmail(email)) {
    return callback('Provide a valid email', undefined)
  } else {
    const output = `
                <h3>Name: </h3> ${fullName}
                <h3>Email: </h3> ${email}
                <h3>Message: </h3> ${message}
            `
    const mailOptions = {
      from: email,
      to: 'cmartin@moderncaliber.com',
      subject: 'Eagle Force Listing Verification Request',
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
  const { fullName, email, message } = req.body
  mailTo(fullName, email, message, (err, data) => {
    res.send({
      fullName,
      email,
      message,
      formResponse: err,
    })
  })
}
