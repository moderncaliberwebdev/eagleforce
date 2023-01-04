import React, { useEffect, useState } from 'react'
import styles from '../styles/ContactPopup.module.scss'

function WorkerVerifyPopup({ cancel, success, error }) {
  const [openPopup, setOpenPopup] = useState(false)

  useEffect(() => {
    if ((success && success.length > 0) || (error && error.length > 0)) {
      setOpenPopup(true)
    }
  }, [success, error])

  const close = () => {
    cancel()
    setOpenPopup(false)
  }

  return (
    <div
      className={styles.popup}
      style={{ display: openPopup ? 'block' : 'none' }}
    >
      <div className={styles.popup__message}>
        <h2>
          {success && success.length > 0
            ? 'Message Sent'
            : error && error.length > 0 && 'Message Failed'}
        </h2>
        <p>{success ? success : error}</p>
        <div className={styles.popup__message__buttons}>
          <button onClick={close}>Close</button>
        </div>
      </div>
    </div>
  )
}

export default WorkerVerifyPopup
