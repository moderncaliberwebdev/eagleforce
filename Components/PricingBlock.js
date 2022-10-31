import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import styles from '../styles/PricingBlock.module.scss'

import { getAuth, onAuthStateChanged } from 'firebase/auth'
import app from '../firebase/clientApp'

const auth = getAuth()

function PricingBlock({
  background,
  backgroundLight,
  color,
  type,
  user,
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
      }
    })
  }, [auth])

  useEffect(() => {
    console.log(currentUser)
  }, [currentUser])

  return (
    <Link
      href={
        currentUser
          ? '/post/worker/create-listing'
          : '/sign-in?error=post-no-user'
      }
      passHref
    >
      <a
        className={styles.block}
        style={{ color: color, backgroundColor: background }}
        onClick={() =>
          localStorage.setItem(
            'planType',
            JSON.stringify({
              user,
              type,
            })
          )
        }
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
        {/* {currentUser ? ( */}
        <button
          className={styles.block__choose}
          style={{ color: color, backgroundColor: backgroundLight }}
        >
          Choose {type} Plan
        </button>
        {/* ) : (
          <button
            className={styles.block__choose}
            style={{ color: color, backgroundColor: backgroundLight }}
            onClick={showError}
          >
            Choose {type} Plan
          </button>
        )} */}
      </a>
    </Link>
  )
}

export default PricingBlock
