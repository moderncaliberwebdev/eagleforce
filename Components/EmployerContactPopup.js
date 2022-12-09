import axios from 'axios'
import React, { useState } from 'react'
import styles from '../styles/EmployerContactPopup.module.scss'

function Popup({ cancel, openPopup, email }) {
  const [yourEmail, setYourEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const sendContactRequest = async () => {
    const data = await axios.post('/api/employer/contact-request', {
      email,
      yourEmail,
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
      setSuccess('Message Sent to Employer')
    }
  }

  return (
    <div
      className={styles.popup}
      style={{ display: openPopup ? 'block' : 'none' }}
    >
      <div className={styles.popup__message}>
        <h2>Contact Employer</h2>
        <p>
          Let the employer know about your interest in them. If you have a
          worker listing, let the employer know your worker number so they can
          evaluate your listing
        </p>
        <div className={styles.popup__message__form}>
          <div className={styles.popup__message__form__input}>
            <label>Email</label>
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
          <p className={styles.popup__message__form__error}>{error && error}</p>
          <p className={styles.popup__message__form__success}>
            {success && success}
          </p>
        </div>
        <div className={styles.popup__message__buttons}>
          <button onClick={cancel}>Cancel</button>
          <button onClick={sendContactRequest}>Send Message</button>
        </div>
      </div>
    </div>
  )
}

export default Popup
