import React, { useState } from 'react'
import styles from '../styles/EmployerContactPopup.module.scss'
import emailjs from '@emailjs/browser'
import validator from 'validator'
import axios from 'axios'

function Popup({ cancel, openPopup, email }) {
  const [yourEmail, setYourEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // const sendContactRequest = async () => {
  //   const data = await axios.post('/api/employer/contact-request', {
  //     email,
  //     yourEmail: yourEmail.replace(/\s+/g, ''),
  //     message,
  //   })
  //   console.log(data)
  //   if (data.data.formResponse && data.data.formResponse.length > 0) {
  //     setError(data.data.formResponse)
  //     setSuccess('')
  //   } else {
  //     setYourEmail('')
  //     setMessage('')
  //     setError('')
  //     setSuccess(true)
  //   }
  // }

  const sendContactRequest = async () => {
    if (yourEmail.length == 0 || !validator.isEmail(yourEmail)) {
      setError('Provide a valid email')
      setSuccess('')
    } else if (message.length == 0) {
      setError('Provide a message')
      setSuccess('')
    } else {
      const data = await axios.post('/api/employer/contact-request', {
        email,
        yourEmail: yourEmail.replace(/\s+/g, ''),
        message,
      })
      console.log(data)
      if (data.data.formResponse && data.data.formResponse.length > 0) {
        setError(data.data.formResponse)
        setSuccess('')
      } else {
        setYourEmail('')
        setMessage('')
        setError('')
        setSuccess(true)
      }
      // emailjs
      //   .send(
      //     'service_gj3bk8b',
      //     'template_iwjam53',
      //     {
      //       from_email: yourEmail.replace(/\s+/g, ''),
      //       message: message,
      //       to_email: email,
      //     },
      //     'vz9G-fr8jrIP_6acx'
      //   )
      //   .then(
      //     (response) => {
      //       console.log('SUCCESS!', response.status, response.text)
      //       setYourEmail('')
      //       setMessage('')
      //       setError('')
      //       setSuccess(true)
      //     },
      //     (err) => {
      //       console.log('FAILED...', err)
      //       setError('Server Error. Try again later')
      //       setSuccess('')
      //     }
      //   )
    }
  }

  const close = () => {
    cancel()
    setSuccess(false)
  }

  return (
    <div
      className={styles.popup}
      style={{ display: openPopup ? 'block' : 'none' }}
    >
      <div className={styles.popup__message}>
        <h2>{success ? 'Message Sent' : 'Contact Employer'}</h2>
        <p>
          {success
            ? 'The employer will get back to you as soon as they can'
            : 'Let the employer know about your interest in them. If you have a worker listing, let the employer know your worker number so they can evaluate your listing'}
        </p>
        {!success && (
          <div className={styles.popup__message__form}>
            <div className={styles.popup__message__form__input}>
              <label>Your Email</label>
              <input
                type='text'
                placeholder='johndoe@gmail.com'
                value={yourEmail}
                onChange={(e) => setYourEmail(e.target.value)}
              />
            </div>
            <div className={styles.popup__message__form__input}>
              <label>Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>
            <p className={styles.popup__message__form__error}>
              {error && error}
            </p>
          </div>
        )}
        <div className={styles.popup__message__buttons}>
          {!success && <button onClick={cancel}>Cancel</button>}
          <button onClick={success ? close : sendContactRequest}>
            {success ? 'Close' : 'Send Message'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Popup
