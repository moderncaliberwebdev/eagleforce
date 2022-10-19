import Head from 'next/head'
import React from 'react'
import Layout from '../Components/Layout'
import styles from '../styles/PostWorker.module.scss'

function Profile() {
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
          content='https://www.eagleforceemploymentservices.com/post/worker'
        />
        <meta property='og:type' content='website' />
        <link rel='icon' href='/images/layout/logo.png' />
      </Head>
      <Layout>
        <main></main>
      </Layout>
    </div>
  )
}

export default Profile
