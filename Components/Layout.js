import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import styles from '../styles/Layout.module.scss'

import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import app from '../firebase/clientApp'

const auth = getAuth()

function Layout({ children }) {
  const [currentUser, setCurrentUser] = useState()

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

  const firebaseSignOut = () => {
    signOut(auth)
      .then(() => {
        setCurrentUser()
        localStorage.clear()
        window.location.href = '/'
      })
      .catch((error) => {
        // An error happened.
      })
  }

  return (
    <div className={styles.layout}>
      <nav className={styles.layout__nav}>
        <div className={styles.layout__nav__logo}>
          <Link href='/' passHref>
            <a>
              <div>
                <Image
                  src='/images/layout/logo.png'
                  alt='Eagle Force Logo'
                  width={80}
                  height={80}
                  layout='fixed'
                />
              </div>
              <h1>
                Eagle Force <span>Employment Services℠</span>
              </h1>
            </a>
          </Link>
        </div>
        <div className={styles.layout__nav__links}>
          <ul>
            <li>
              About
              <img src='/images/layout/arrow.png' alt='Dropdown Arrow' />
              <div>
                <Link href='/about-us' passHref>
                  <a>About Us</a>
                </Link>
                <Link href='/terms-and-conditions' passHref>
                  <a>Terms and Conditions</a>
                </Link>
              </div>
            </li>
            <li>
              <Link href='/contact' passHref>
                <a>Contact</a>
              </Link>
            </li>
            <li>
              Find Jobs
              <img src='/images/layout/arrow.png' alt='Dropdown Arrow' />
              <div>
                <Link href='/employers' passHref>
                  <a>See all Employers</a>
                </Link>
                <Link href='/post/worker' passHref>
                  <a>Post a Worker Listing</a>
                </Link>
              </div>
            </li>
            <li>
              Find Workers
              <img src='/images/layout/arrow.png' alt='Dropdown Arrow' />
              <div>
                <Link href='/workers' passHref>
                  <a>See all Workers</a>
                </Link>
                <Link href='/post/employer' passHref>
                  <a>Post an Employer Listing</a>
                </Link>
              </div>
            </li>
          </ul>
        </div>
        <div className={styles.layout__nav__signin}>
          {currentUser ? (
            // <Link href='/profile'>
            <figure>
              <a onClick={firebaseSignOut}>Sign Out</a>
            </figure>
          ) : (
            // </Link>
            <Link href='/sign-in'>
              <figure>
                <a>Sign In</a>
              </figure>
            </Link>
          )}
        </div>
      </nav>
      {children}
      <footer className={styles.layout__footer}>
        <div className={styles.layout__footer__top}>
          <div className={styles.layout__footer__top__left}>
            <Link href='/' passHref>
              <a>
                <Image
                  src='/images/layout/logo.png'
                  alt='Eagle Force Logo'
                  width={80}
                  height={80}
                  layout='fixed'
                />
                <h2>
                  Eagle Force <span>Employment Services℠</span>
                </h2>
              </a>
            </Link>
          </div>
          <div className={styles.layout__footer__top__right}>
            <ul>
              <ul>
                <li>
                  <Link href='/about' passHref>
                    <a>About</a>
                  </Link>
                </li>
                <li>
                  <Link href='/contact' passHref>
                    <a>Contact</a>
                  </Link>
                </li>
                <li>
                  <Link href='/terms-and-conditions' passHref>
                    <a>Terms and Conditions</a>
                  </Link>
                </li>
              </ul>
              <ul>
                <li>
                  <Link href='/employers' passHref>
                    <a>See all Employers</a>
                  </Link>
                </li>
                <li>
                  <Link href='/post/worker' passHref>
                    <a>Post a Worker Listing</a>
                  </Link>
                </li>
              </ul>
              <ul>
                <li>
                  <Link href='/workers' passHref>
                    <a>See all Workers</a>
                  </Link>
                </li>
                <li>
                  <Link href='/post/employer' passHref>
                    <a>Post an Employer Listing</a>
                  </Link>
                </li>
              </ul>
              <li>
                <Link href='/sign-in' passHref>
                  <a>Sign In</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.layout__footer__bottom}>
          <div className={styles.layout__footer__bottom__left}>
            <p>Eagle Force Employment Services℠</p>
            <p className={styles.layout__footer__bottom__left__host}>
              Hosted by De Stefano Enterprises, LLC, all rights reserved
            </p>
          </div>
          <div className={styles.layout__footer__bottom__right}>
            <p>
              Website by
              <Link href='https://moderncaliber.com/' passHref>
                <a>Modern Caliber Web Development</a>
              </Link>
            </p>
            <p>
              Icons from
              <Link href='https://icons8.com/' passHref>
                <a>Icons8</a>
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
