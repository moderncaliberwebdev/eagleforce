import React, { useState } from 'react'
// import firebase from '../firebase/clientApp'
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import validator from 'validator'
import app from '../firebase/clientApp'
import Head from 'next/head'
import Layout from '../Components/Layout'
import Image from 'next/image'
import Link from 'next/link'
// import { useAuthState } from 'react-firebase-hooks/auth'

import styles from '../styles/SignUp.module.scss'
import axios from 'axios'

function SignUp() {
  // User Authentication
  //   const [user, loading, error] = useAuthState(firebase.auth())
  const auth = getAuth(app)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState('')
  const [checked, setChecked] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [showPass, setShowPass] = useState(false)

  const signUp = () => {
    //front end validation
    const allFilled =
      name.length > 0 &&
      email.length > 0 &&
      password.length > 0 &&
      userType.length > 0
    const isEmail = validator.isEmail(email)

    if (!allFilled) {
      setErrorMsg('Please fill in all fields')
    } else if (!isEmail) {
      setErrorMsg('Please provide a valid email')
    } else if (!checked) {
      setErrorMsg('Please confirm that you have read the terms and conditions')
    } else if (document.querySelector('#honeypot').value.length == 0) {
      setErrorMsg('')
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          // Signed in
          const user = userCredential.user
          updateProfile(auth.currentUser, {
            displayName: `${userType} - ${name}`,
          })

          await axios.post('/api/create-user', {
            name,
            email,
            userType,
            savedListings: [],
          })

          setSuccessMsg('Successfully created user')
          setName('')
          setEmail('')
          setPassword('')
          setUserType('')
          setChecked(false)
          setErrorMsg('')
          window.location.href = '/profile'
        })
        .catch((error) => {
          const errorMessage = error.message
          setErrorMsg(errorMessage)
        })
    }
  }

  const handleUserType = (e) => {
    setUserType(e.target.value)
    console.log(e.target.value)
  }

  const showPassword = () => {
    const x = document.getElementById('myInput')
    if (x.type === 'password') {
      x.type = 'text'
      setShowPass(true)
    } else {
      x.type = 'password'
      setShowPass(false)
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Sign Up | Eagle Force Employment Services</title>
        <meta
          name='description'
          content='Start your employment search journey with us.'
        />
        <meta
          property='og:title'
          content='Sign Up | Eagle Force Employment Services'
        />
        <meta
          property='og:description'
          content='Start your employment search journey with us.'
        />
        <meta
          property='og:url'
          content='https://www.eagleforceemploymentservices.com/sign-up'
        />
        <meta property='og:type' content='website' />
        <link rel='icon' href='/images/layout/logo.png' />
      </Head>
      <Layout>
        <main>
          <section className={styles.signup}>
            <div className={styles.signup__graphic}>
              <Image
                src='/images/signin/signup-graphic.png'
                width={549}
                height={790}
                objectFit='cover'
              />
            </div>
            <div className={styles.signup__form}>
              <h1>Sign Up</h1>
              <p>
                Already have an account?
                <Link href='/sign-in' passHref>
                  <a>Sign In!</a>
                </Link>
              </p>
              <div className={styles.signup__form__radios}>
                <h2>What are you looking for?</h2>
                <div className={styles.signup__form__radios__radios}>
                  <label>
                    <input
                      type='radio'
                      name='userType'
                      value='Employment'
                      onChange={(e) => handleUserType(e)}
                      checked={userType == 'Employment'}
                    />
                    Employment
                  </label>
                  <label>
                    <input
                      type='radio'
                      name='userType'
                      value='Workers'
                      onChange={(e) => handleUserType(e)}
                      checked={userType == 'Workers'}
                    />
                    Workers
                  </label>
                </div>
              </div>
              <div className={styles.signup__form__input}>
                <label>
                  {userType == 'Workers' ? 'Company Name' : 'Full Name'}
                </label>
                <input
                  type='text'
                  placeholder='John Doe'
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className={styles.signup__form__input}>
                <label>Email</label>
                <input
                  type='email'
                  placeholder='johndoe@gmail.com'
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className={styles.signup__form__honeypot}>
                <input type='text' id='honeypot' />
              </div>
              <div className={styles.signup__form__input}>
                <label>Password</label>
                <input
                  type='password'
                  id='myInput'
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p onClick={showPassword}>
                  {showPass ? 'Hide Password' : 'Show Password'}
                </p>
              </div>
              <label className={styles.signup__form__check}>
                <input
                  type='checkbox'
                  onChange={() => setChecked(!checked)}
                  checked={checked}
                />
                I agree to the
                <Link href='/terms-and-conditions' passHref>
                  <a>terms and conditions</a>
                </Link>
              </label>
              <button
                className={styles.signup__form__submit}
                onClick={() => signUp()}
              >
                Create account
              </button>
              <p className={styles.signup__form__error}>
                {errorMsg && errorMsg.length > 0 && errorMsg}
              </p>
              <p className={styles.signup__form__success}>
                {successMsg && successMsg.length > 0 && successMsg}
              </p>
            </div>
          </section>
        </main>
      </Layout>
    </div>
  )
}

export default SignUp
