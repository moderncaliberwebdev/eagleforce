import sgMail from '@sendgrid/mail'
import validator from 'validator'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const mailTo = (user, callback) => {
  //validation
  const output = `
  <h3>Updated User!</h3> 
  A listing from your account was just updated. If you did not request this, please contact Eagle Force Support. support@eagleforceemploymentservices.com
          `
  const msg = {
    from: {
      name: 'Eagle Force Worker Contact',
      email: 'support@eagleforceemploymentservices.com',
    },
    to: user,
    subject: 'Updated User Listings',
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

export default function mail(req, res) {
  const { user } = req.body
  mailTo(user, (err, data) => {
    res.send({
      user,
      formResponse: err,
    })
  })
}
