import Head from 'next/head'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Layout from '../../../Components/Layout'
import WorkerBreadcrumbs from '../../../Components/WorkerBreadcrumbs'
import styles from '../../../styles/VerifyWorkerListing.module.scss'

function VerifyWorkerListing() {
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
          <h1>Verify Worker Listing</h1>
          <WorkerBreadcrumbs />
          <p>
            Your listing has been posted to the board. The next step is
            verification. Contact the site administrator using the form below to
            get your listing verified
          </p>
          <div className={styles.verify__form}>
            <div className={styles.verify__form__input}>
              <label>Full Name</label>
              <input type='text' placeholder='John Doe' />
            </div>
            <div className={styles.verify__form__input}>
              <label>Email</label>
              <input type='text' placeholder='johndoe@gmail.com' />
            </div>
            <div className={styles.verify__form__input}>
              <label>Message</label>
              <textarea></textarea>
            </div>
            <button className={styles.verify__form__submit}>
              Send Verification Message
            </button>
          </div>
        </main>
      </Layout>
    </div>
  )
}

export default VerifyWorkerListing
