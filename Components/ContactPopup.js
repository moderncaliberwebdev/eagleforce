import axios from 'axios'
import React, { useState } from 'react'
import styles from '../styles/ContactPopup.module.scss'

function Popup({ cancel, openPopup, worker }) {
  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [yourEmail, setYourEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const sendContactRequest = async () => {
    const data = await axios.post('/api/worker/contact-request', {
      fullName,
      companyName,
      yourEmail: yourEmail.replace(/\s+/g, ''),
      message,
      worker,
    })
    data.data.formResponse && setError(data.data.formResponse)
    if (data.data.yourEmail) {
      setFullName('')
      setCompanyName('')
      setYourEmail('')
      setMessage('')
      setError('')
      setSuccess(
        'Message Sent. We will work on getting you in touch with this worker as soon as possible'
      )
    }
  }

  return (
    <div
      className={styles.popup}
      style={{ display: openPopup ? 'block' : 'none' }}
    >
      <div className={styles.popup__message}>
        <h2>Contact Worker</h2>
        <p>
          Let us know about your interest in this worker. For anonymity, the
          worker's contact information is kept private. Upon contacting us, we
          will give your contact info to the worker and they will reach out to
          you directly.
        </p>
        <div className={styles.popup__message__form}>
          <div className={styles.popup__message__form__input}>
            <label>Full Name</label>
            <input
              type='text'
              placeholder='John Doe'
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className={styles.popup__message__form__input}>
            <label>Company Name</label>
            <input
              type='text'
              placeholder='Eagle Force Employment Services'
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
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
