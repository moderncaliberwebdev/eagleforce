import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import Layout from '../../Components/Layout'
import styles from '../../styles/Profile.module.scss'
import { useRouter } from 'next/router'

import {
  getAuth,
  onAuthStateChanged,
  updateProfile,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
} from 'firebase/auth'
import app from '../../firebase/clientApp'
import axios from 'axios'
import ProfileBreadcrumbs from '../../Components/ProfileBreadcrumbs'

const auth = getAuth()

function Profile() {
  const { query } = useRouter()

  const [currentUser, setCurrentUser] = useState()
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [requirePassword, setRequirePassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [passwordResetClicked, setPasswordResetClicked] = useState(false)

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const config = {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
        const data = await axios.get(`/api/user?email=${user.email}`, config)
        setCurrentUser(data.data.user)
      } else {
        window.location.href = '/'
      }
    })
  }, [auth])

  useEffect(() => {
    if (query && query.state && query.state == 'new-email') {
      setSuccessMsg('Email Has Been Changed')
    }
  }, [query])

  const updateFullName = () => {
    const newName = `${currentUser.name.split(' - ')[0]} - ${fullName}`

    updateProfile(auth.currentUser, {
      displayName: newName,
    })
      .then(async () => {
        const config = {
          headers: { Authorization: `Bearer ${auth.currentUser.accessToken}` },
        }
        const data = await axios.put(
          `/api/user/fullName`,
          {
            email: currentUser.email.toLowerCase(),
            name: newName,
          },
          config
        )
        data && window.location.reload()
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const updateDBEmail = async () => {
    const config = {
      headers: { Authorization: `Bearer ${auth.currentUser.accessToken}` },
    }
    const data = await axios.put(
      `/api/user/email`,
      {
        email: currentUser.email,
        newEmail: email,
      },
      config
    )
    if (data) window.location.href = '/profile?state=new-email'
  }

  const updateEmailFunction = () => {
    updateEmail(auth.currentUser, email)
      .then(() => {
        updateDBEmail()
      })
      .catch((error) => {
        setRequirePassword(true)
      })
  }

  const passwordReset = () => {
    sendPasswordResetEmail(auth, currentUser.email)
      .then(() => {
        setPasswordResetClicked(true)
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        // ..
      })
  }

  const updateEmailWithCredentials = () => {
    const credential = EmailAuthProvider.credential(currentUser.email, password)

    reauthenticateWithCredential(auth.currentUser, credential)
      .then(() => {
        updateEmail(auth.currentUser, email)
          .then(() => {
            updateDBEmail()
          })
          .catch((error) => {
            const errorMessage = error.message.replace('Firebase: ', '')
            setErrorMsg(errorMessage)
          })
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <div className={styles.container}>
      <Head>
        <title> Profile | Eagle Force Employment Services</title>
        <meta
          property='og:title'
          content='Profile| Eagle Force Employment Services'
        />

        <meta
          property='og:url'
          content='https://www.eagleforceemploymentservices.com/profile'
        />
        <meta property='og:type' content='website' />
        <link rel='icon' href='/images/layout/logo.png' />
      </Head>
      <Layout>
        <main>
          <h1>Profile</h1>

          <ProfileBreadcrumbs admin={currentUser && currentUser.admin} />
          <div className={styles.settings}>
            <p className={styles.settings__instruct}>
              If you want to change your name or email, edit your current
              information in the text boxes below and click the corresponding
              update button. To edit your password, click the Reset Button
              password.
            </p>
            <div className={styles.settings__input}>
              <label>
                {currentUser && currentUser.name.split(' - ')[0] == 'Workers'
                  ? 'Company Name'
                  : 'Full Name'}
              </label>
              <input
                type='text'
                defaultValue={currentUser && currentUser.name.split(' - ')[1]}
                onChange={(e) => setFullName(e.target.value)}
              />
              <button onClick={updateFullName} disabled={fullName.length == 0}>
                Update Full Name
              </button>
            </div>
            <div className={styles.settings__input}>
              <label>Email</label>
              <input
                type='text'
                defaultValue={currentUser && currentUser.email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {!requirePassword && (
                <button
                  onClick={updateEmailFunction}
                  disabled={email.length == 0}
                >
                  Update Email
                </button>
              )}
            </div>
            {requirePassword && (
              <div className={styles.settings__input}>
                <label>Your password is required to reset your email</label>
                <input
                  type='text'
                  placeholder='Password'
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  onClick={updateEmailWithCredentials}
                  disabled={password.length == 0}
                >
                  Update Email
                </button>
              </div>
            )}
            {successMsg && (
              <p className={styles.settings__success}>{successMsg}</p>
            )}
            {errorMsg && <p className={styles.settings__error}>{errorMsg}</p>}
            <div className={styles.settings__password}>
              <button onClick={passwordReset}>Reset Password</button>
              <label>You will be sent an email with instructions</label>
              {passwordResetClicked && (
                <p>Email has been sent. Make sure to check your spam folder</p>
              )}
            </div>
          </div>
        </main>
      </Layout>
    </div>
  )
}

export default Profile
