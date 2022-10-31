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

const mailTo = (
  fullName,
  companyName,
  yourEmail,
  message,
  worker,
  callback
) => {
  //validation
  if (!fullName || !companyName || !yourEmail || !message) {
    return callback('Please fill in all fields', undefined)
  } else if (!validator.isEmail(yourEmail)) {
    return callback('Provide a valid email', undefined)
  } else {
    const output = `
                <h3>Name: </h3> ${fullName}
                <h3>Company Name: </h3> ${companyName}
                <h3>Worker to Contact: </h3> #${worker}
                <h3>Email: </h3> ${yourEmail}
                <h3>Message: </h3> ${message}
            `
    const mailOptions = {
      from: yourEmail,
      to: 'contact@eagleforceemploymentservices.com',
      //   to: 'cmartin@moderncaliber.com',
      subject: 'Eagle Force Contact Request',
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
  const { fullName, companyName, yourEmail, message, worker } = req.body
  mailTo(fullName, companyName, yourEmail, message, worker, (err, data) => {
    res.send({
      fullName,
      companyName,
      yourEmail,
      message,
      worker,
      formResponse: err,
    })
  })
}