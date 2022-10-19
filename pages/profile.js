import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import Layout from '../Components/Layout'
import styles from '../styles/PostWorker.module.scss'

import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import app from '../firebase/clientApp'
import axios from 'axios'

const auth = getAuth()

function Profile() {
  const [currentUser, setCurrentUser] = useState()

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
