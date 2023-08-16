import sgMail from '@sendgrid/mail'
import validator from 'validator'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

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
    const msg = {
      from: {
        name: 'Eagle Force Contact',
        email: 'support@eagleforceemploymentservices.com',
      },
      to: 'support@eagleforceemploymentservices.com',
      subject: 'Eagle Force Support Team',
      html: output,
    }
    const sendSGMail = async () => {
      try {
        await sgMail.send(msg)

        callback(undefined, { sent: true })
      } catch (error) {
        console.error(error)

        if (error.response) {
          console.error(error.response.body)
        }
      }
    }
    sendSGMail()
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
