import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import Layout from '../../Components/Layout'
import styles from '../../styles/YourListings.module.scss'

import ProfileBreadcrumbs from '../../Components/ProfileBreadcrumbs'
import PreviousEmployerListing from '../../Components/PreviousEmployerListing'

import { getAuth, onAuthStateChanged } from 'firebase/auth'
import app from '../../firebase/clientApp'
import axios from 'axios'

const auth = getAuth()

function ProfileWorkers() {
  const [currentUser, setCurrentUser] = useState()
  const [userFromDB, setUserFromDB] = useState()
  const [listings, setListings] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user)
        const config = {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
        const data = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api/employer/get-employers`
        )

        data && setLoading(false)
        setListings(JSON.parse(JSON.stringify(data.data)))

        const userData = await axios.get(
          `/api/user?email=${user.email}`,
          config
        )
        setUserFromDB(userData.data.user)
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
          content='Profile | Eagle Force Employment Services'
        />

        <meta
          property='og:url'
          content='https://www.eagleforceemploymentservices.com/profile/employers'
        />
        <meta property='og:type' content='website' />
        <link rel='icon' href='/images/layout/logo.png' />
      </Head>
      <Layout>
        <main>
          <h1>All Employers</h1>
          <ProfileBreadcrumbs admin={userFromDB && userFromDB.admin} />
          <div className={styles.blocks}>
            {loading && (
              <p className={styles.blocks__loading}>Loading Listings...</p>
            )}
            {listings &&
              listings.featuredEmployers.length > 0 &&
              listings.featuredEmployers.map((listing) => (
                <PreviousEmployerListing
                  listing={listing}
                  key={listing._id}
                  currentUser={currentUser}
                  admin={true}
                />
              ))}
            {listings &&
              listings.standardEmployers.length > 0 &&
              listings.standardEmployers.map((listing) => (
                <PreviousEmployerListing
                  listing={listing}
                  key={listing._id}
                  currentUser={currentUser}
                  admin={true}
                />
              ))}
          </div>
        </main>
      </Layout>
    </div>
  )
}

export default ProfileWorkers
