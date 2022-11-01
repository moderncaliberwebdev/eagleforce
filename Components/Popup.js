import React from 'react'
import styles from '../styles/Popup.module.scss'

function Popup({
  question,
  desc,
  answer,
  no,
  cancel,
  next,
  openPopup,
  renew,
  color,
}) {
  return (
    <div
      className={styles.popup}
      style={{ display: openPopup ? 'block' : 'none' }}
    >
      <div className={styles.popup__message}>
        <h2>{question}</h2>
        <p>{desc}</p>
        <div
          className={styles.popup__message__buttons}
          style={{ flexDirection: renew ? 'row-reverse' : 'row' }}
        >
          {renew ? (
            <>
              <button
                onClick={next}
                style={{
                  backgroundColor: color == 'red' ? '#c9a596' : '#96a4c9',
                }}
              >
                {answer}
              </button>
              <button onClick={cancel}>{no}</button>
            </>
          ) : (
            <>
              <button
                onClick={cancel}
                style={{
                  backgroundColor: color == 'red' ? '#c9a596' : '#96a4c9',
                }}
              >
                {no}
              </button>
              <button onClick={next}>{answer}</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Popup
