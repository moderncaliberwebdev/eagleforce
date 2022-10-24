import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import Layout from '../../Components/Layout'
import styles from '../../styles/YourListings.module.scss'

import { getAuth, onAuthStateChanged } from 'firebase/auth'
import app from '../../firebase/clientApp'
import axios from 'axios'
import ProfileBreadcrumbs from '../../Components/ProfileBreadcrumbs'
import YourListing from '../../Components/YourListing'

const auth = getAuth()

function Listings() {
  const [currentUser, setCurrentUser] = useState()
  const [listings, setListings] = useState()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user)
        setLoading(true)
        const config = {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
        const data = await axios.get(
          `/api/user/listings?email=${user.email}`,
          config
        )
        data && setLoading(false)
        setListings(JSON.parse(JSON.stringify(data.data.docs)))
      } else {
        window.location.href = '/'
      }
    })
  }, [auth])

  return (
    <div className={styles.container}>
      <Head>
        <title> Your Listings | Eagle Force Employment Services</title>
        <meta
          property='og:title'
          content='Your Listings| Eagle Force Employment Services'
        />

        <meta
          property='og:url'
          content='https://www.eagleforceemploymentservices.com/profile/listings'
        />
        <meta property='og:type' content='website' />
        <link rel='icon' href='/images/layout/logo.png' />
      </Head>
      <Layout>
        <main>
          <h1>Your Listings</h1>
          <ProfileBreadcrumbs />
          <div className={styles.nav}>
            <p> Current Listings ({listings && listings.length})</p>
            <p> Previous Listings (0)</p>
          </div>
          <div className={styles.blocks}>
            {loading && (
              <p className={styles.blocks__loading}>Loading Listings...</p>
            )}
            {listings &&
              listings.map((listing) => (
                <YourListing
                  listing={listing}
                  key={listing._id}
                  currentUser={currentUser}
                />
              ))}
          </div>
        </main>
      </Layout>
    </div>
  )
}

export default Listings
