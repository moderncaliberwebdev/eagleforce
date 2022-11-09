import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import app from '../firebase/clientApp'
import validator from 'validator'
import Head from 'next/head'
import Layout from '../Components/Layout'
import Image from 'next/image'
import Link from 'next/link'

import styles from '../styles/SignUp.module.scss'

function SignIn() {
  const { query } = useRouter()
  const router = useRouter()

  const auth = getAuth(app)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    if (
      router.isReady &&
      query.error &&
      (query.error == 'post-no-user' || query.error == 'post-no-user-employer')
    ) {
      setErrorMsg('You must be signed in to create a listing')
    }
  }, [query])

  const signUp = () => {
    //front end validation
    const allFilled = email.length > 0 && password.length > 0
    const isEmail = validator.isEmail(email)

    if (!allFilled) {
      setErrorMsg('Please fill in all fields')
    } else if (!isEmail) {
      setErrorMsg('Please provide a valid email')
    } else if (document.querySelector('#honeypot').value.length == 0) {
      setErrorMsg('')
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user

          setSuccessMsg('Successfully logged in user')
          setEmail('')
          setPassword('')
          setErrorMsg('')

          if (query.error) {
            if (query.error == 'post-no-user') {
              window.location.href = '/post/worker'
            } else if (query.error == 'post-no-user-employer')
              window.location.href = '/post/employer'
          } else window.location.href = '/'
        })
        .catch((error) => {
          const errorMessage = error.message.replace('Firebase: ', '')
          setErrorMsg(errorMessage)
        })
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Sign In | Eagle Force Employment Services</title>
        <meta
          name='description'
          content='Start your employment search journey with us.'
        />
        <meta
          property='og:title'
          content='Sign In | Eagle Force Employment Services'
        />
        <meta
          property='og:description'
          content='Start your employment search journey with us.'
        />
        <meta
          property='og:url'
          content='https://www.eagleforceemploymentservices.com/sign-in'
        />
        <meta property='og:type' content='website' />
        <link rel='icon' href='/images/layout/logo.png' />
      </Head>
      <Layout>
        <main>
          <section className={styles.signup}>
            <div className={styles.signup__graphic}>
              <Image
                src='/images/signin/signin-graphic.png'
                width={549}
                height={790}
                objectFit='cover'
              />
            </div>
            <div className={styles.signup__form}>
              <h1>Sign In</h1>
              <p>
                Don&apos;t have an account yet?
                <Link href='/sign-up' passHref>
                  <a className={styles.blue_text}>Sign Up!</a>
                </Link>
              </p>

              <div className={styles.signup__form__input}>
                <label className={styles.blue_text}>Email</label>
                <input
                  type='email'
                  placeholder='johndoe@gmail.com'
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.blue_border_thin}
                />
              </div>
              <div className={styles.signup__form__honeypot}>
                <input type='text' id='honeypot' />
              </div>
              <div className={styles.signup__form__input}>
                <label className={styles.blue_text}>Password</label>
                <input
                  type='password'
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.blue_border_thin}
                />
              </div>

              <button
                className={`${styles.signup__form__submit} ${styles.blue_background}`}
                onClick={() => signUp()}
              >
                Sign In
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

export default SignIn
