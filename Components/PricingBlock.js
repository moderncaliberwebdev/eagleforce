import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import styles from '../styles/PricingBlock.module.scss'

import { getAuth, onAuthStateChanged } from 'firebase/auth'
import app from '../firebase/clientApp'

function PricingBlock({
  background,
  backgroundLight,
  color,
  type,
  price,
  occurance,
  features,
}) {
  const [currentUser, setCurrentUser] = useState()

  const showError = () => {
    const error = document.querySelector('#error')
    error.style.display = 'block'
  }

  useEffect(() => {
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid
        setCurrentUser(user)
        // ...
      } else {
        // User is signed out
        // ...
        setCurrentUser({ user: false })
      }
    })
  }, [])

  return (
    <div
      className={styles.block}
      style={{ color: color, backgroundColor: background }}
    >
      <h2>{type} Listing</h2>
      <h3>
        ${price} / {occurance}
      </h3>
      <div className={styles.block__features}>
        {features &&
          features.map((feature) => (
            <div className={styles.block__features__item} key={feature}>
              <div
                className={styles.block__features__item__check}
                style={{ borderColor: color }}
              ></div>
              <p>{feature}</p>
            </div>
          ))}
      </div>
      {currentUser ? (
        <Link href='/post/worker/create-listing' passHref>
          <a
            className={styles.block__choose}
            style={{ color: color, backgroundColor: backgroundLight }}
          >
            Choose {type} Plan
          </a>
        </Link>
      ) : (
        <a
          className={styles.block__choose}
          style={{ color: color, backgroundColor: backgroundLight }}
          onClick={showError}
        >
          Choose {type} Plan
        </a>
      )}
    </div>
  )
}

export default PricingBlock
