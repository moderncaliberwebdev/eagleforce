import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import Layout from '../../../Components/Layout'
import WorkerBreadcrumbs from '../../../Components/WorkerBreadcrumbs'

import styles from '../../../styles/VerifyWorkerListing.module.scss'

import { getAuth, onAuthStateChanged } from 'firebase/auth'
import app from '../../../firebase/clientApp'
import axios from 'axios'
import WorkerVerifyPopup from '../../../Components/WorkerVerifyPopup'

const auth = getAuth()

function VerifyWorkerListing() {
  const [currentUser, setCurrentUser] = useState()
  const [listings, setListings] = useState()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user)
        const config = {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
        const data = await axios.get(
          `/api/user/listings?email=${user.email}`,
          config
        )
        setListings(JSON.parse(JSON.stringify(data.data.docs)))
      } else {
        window.location.href = '/'
      }
    })
  }, [auth])

  const verify = async () => {
    let isVerified = false
    if (listings.length > 0) {
      listings.forEach((listing) => {
        if (listing.verified) isVerified = true
      })
    } else setError('You do not have any listings')

    if (isVerified) {
      setError('Your listing(s) is already verified')
    } else {
      const data = await axios.post('/api/worker/verify-listing', {
        fullName,
        email,
        message,
      })
      data.data.formResponse && setError(data.data.formResponse)
      if (data.data.email) {
        setFullName('')
        setEmail('')
        setMessage('')
        setError('')
        setSuccess(
          'Message Sent. We will work on getting your listing verified as soon as possible'
        )
      }
    }
  }

  const cancel = () => {
    setSuccess('')
    setError('')
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Verify Worker Listing | Eagle Force Employment Services</title>
        <meta
          name='description'
          content='Your listing has been posted to the board.  The next step is verification. Contact the site administrator using the form below to get your listing verified'
        />
        <meta
          property='og:title'
          content='Verify Worker Listing | Eagle Force Employment Services'
        />
        <meta
          property='og:description'
          content='Your listing has been posted to the board.  The next step is verification. Contact the site administrator using the form below to get your listing verified'
        />
        <meta
          property='og:url'
          content='https://www.eagleforceemploymentservices.com/post/worker/preview-listing'
        />
        <meta property='og:type' content='website' />
        <link rel='icon' href='/images/layout/logo.png' />
      </Head>
      <Layout>
        <main className={styles.verify}>
          <WorkerVerifyPopup cancel={cancel} success={success} error={error} />
          <h1>Verify Worker Listing</h1>
          <WorkerBreadcrumbs />
          <p>
            Your listing is being approved. It will be posted to the board upon
            approval from the site admin. This may take a few days. The next
            step is verification. Contact the site administrator using the form
            below to get your listing verified
          </p>
          <div className={styles.verify__form}>
            <div className={styles.verify__form__input}>
              <label>Full Name</label>
              <input
                type='text'
                placeholder='John Doe'
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className={styles.verify__form__input}>
              <label>Email</label>
              <input
                type='text'
                placeholder='johndoe@gmail.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.verify__form__input}>
              <label>Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>
            <button className={styles.verify__form__submit} onClick={verify}>
              Send Verification Message
            </button>
          </div>
        </main>
      </Layout>
    </div>
  )
}

export default VerifyWorkerListing
