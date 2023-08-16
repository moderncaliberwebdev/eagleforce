import sgMail from '@sendgrid/mail'
import validator from 'validator'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

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
    const msg = {
      from: {
        name: 'Eagle Force Worker Contact',
        email: 'support@eagleforceemploymentservices.com',
      },
      replyTo: yourEmail,
      to: 'contact@eagleforceemploymentservices.com',
      // to: 'cmartin@moderncaliber.com',
      subject: 'Eagle Force Contact Request',
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
