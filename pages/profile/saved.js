import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import Layout from '../../Components/Layout'
import styles from '../../styles/Profile.module.scss'

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

function SavedListings() {
  const [currentUser, setCurrentUser] = useState()

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const config = {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
        const data = await axios.get(`/api/user?email=${user.email}`, config)
        setCurrentUser(data.data.user)
        console.log(user.email)
      } else {
        window.location.href = '/'
      }
    })
  }, [auth])

  return (
    <div className={styles.container}>
      <Head>
        <title> Saved Listings | Eagle Force Employment Services</title>
        <meta
          property='og:title'
          content='Saved Listings| Eagle Force Employment Services'
        />

        <meta
          property='og:url'
          content='https://www.eagleforceemploymentservices.com/profile/saved'
        />
        <meta property='og:type' content='website' />
        <link rel='icon' href='/images/layout/logo.png' />
      </Head>
      <Layout>
        <main>
          <h1>Saved Listings</h1>
          <ProfileBreadcrumbs />
        </main>
      </Layout>
    </div>
  )
}

export default SavedListings
