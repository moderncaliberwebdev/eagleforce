import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import styles from '../styles/Layout.module.scss'

import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import app from '../firebase/clientApp'

const auth = getAuth()

function Layout({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [open, setOpen] = useState(false)
  const [isSmallScreenState, setIsSmallScreenState] = useState(false)

  const isSmallScreen = useMediaQuery({ query: '(max-width: 1000px)' })

  useEffect(() => {
    setIsSmallScreenState(isSmallScreen)
  }, [isSmallScreen])

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
              <div className={styles.layout__nav__logo__logo}>
                <Image
                  src='/images/layout/logo.png'
                  alt='Eagle Force Logo'
                  width={80}
                  height={80}
                  layout='fixed'
                />
              </div>
              <div className={styles.layout__nav__logo__mobile}>
                <Image
                  src='/images/layout/logo.png'
                  alt='Eagle Force Logo'
                  width={50}
                  height={50}
                  layout='fixed'
                />
              </div>
              <h1>
                Eagle Force <span>Employment Services℠</span>
                <span>Get Your Career On℠</span>
              </h1>
            </a>
          </Link>
        </div>
        <div className={styles.layout__nav__links}>
          <ul id='ul'>
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
            {isSmallScreenState &&
              (currentUser ? (
                <li>
                  <Link href='/profile' passHref>
                    <a>Your Profile</a>
                  </Link>
                  <div>
                    <a onClick={firebaseSignOut}>Sign Out</a>
                  </div>
                </li>
              ) : (
                <li>
                  <Link href='/sign-in' passHref>
                    <a>Sign In</a>
                  </Link>
                  <div>
                    <Link href='/sign-up' passHref>
                      <a>Sign Up</a>
                    </Link>
                  </div>
                </li>
              ))}
          </ul>
        </div>
        <div className={styles.layout__nav__signin}>
          {currentUser ? (
            <>
              <Link href='/profile'>
                <figure>
                  <a>Your Profile</a>
                </figure>
              </Link>
              <p>
                <a onClick={firebaseSignOut}>Sign Out</a>
              </p>
            </>
          ) : (
            <>
              <Link href='/sign-up'>
                <a className={styles.layout__nav__signin__signup}>Sign Up</a>
              </Link>
              <Link href='/sign-in'>
                <figure>
                  <a>Sign In</a>
                </figure>
              </Link>
            </>
          )}
        </div>
        <div
          className={styles.layout__nav__button}
          onClick={() => {
            document.getElementById('ul').style.display = open ? 'none' : 'flex'
            setOpen(!open)
          }}
          style={{
            transform: open && 'translateY(20px)',
          }}
        >
          <div
            className={styles.layout__nav__button_1}
            id='a'
            style={{
              transform: open && 'rotate(45deg)',
            }}
          ></div>
          <div
            className={styles.layout__nav__button_2}
            id='b'
            style={{
              width: open ? '6rem' : '5rem',
              transform: open ? 'rotate(-45deg)' : 'translateY(10px)',
            }}
          ></div>
          <div
            className={styles.layout__nav__button_3}
            id='c'
            style={{ opacity: open ? '0' : '1' }}
          ></div>
        </div>
      </nav>
      {children}
      <footer className={styles.layout__footer}>
        <div className={styles.layout__footer__top}>
          <div className={styles.layout__footer__top__left}>
            <Link href='/' passHref>
              <a>
                <div className={styles.layout__footer__top__left__logo}>
                  <Image
                    src='/images/layout/logo.png'
                    alt='Eagle Force Logo'
                    width={80}
                    height={80}
                    layout='fixed'
                  />
                </div>
                <div className={styles.layout__footer__top__left__mobile}>
                  <Image
                    src='/images/layout/logo.png'
                    alt='Eagle Force Logo'
                    width={50}
                    height={50}
                    layout='fixed'
                  />
                </div>
                <h2>
                  Eagle Force <span>Employment Services℠</span>
                  <span>Get Your Career On℠</span>
                </h2>
              </a>
            </Link>
          </div>
          <div className={styles.layout__footer__top__right}>
            <ul>
              <ul>
                <li>
                  <Link href='/about-us' passHref>
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
              <ul>
                <li>
                  <Link href='/sign-in' passHref>
                    <a>Sign In</a>
                  </Link>
                </li>
              </ul>
            </ul>
          </div>
        </div>
        <div className={styles.layout__footer__bottom}>
          <div className={styles.layout__footer__bottom__left}>
            <p>
              Eagle Force Employment Services℠ is a division of De Stefano
              Enterprises, LLC. All rights are reserved
            </p>
            <p className={styles.layout__footer__bottom__left__host}></p>
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
