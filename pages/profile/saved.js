import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import Layout from '../../Components/Layout'
import styles from '../../styles/Saved.module.scss'

import { getAuth, onAuthStateChanged } from 'firebase/auth'
import app from '../../firebase/clientApp'
import axios from 'axios'
import ProfileBreadcrumbs from '../../Components/ProfileBreadcrumbs'

import WorkerListingSide from '../../Components/WorkerListingSide'
import FeaturedWorkerListingBlock from '../../Components/FeaturedWorkerListingBlock'
import WorkerListingBlock from '../../Components/WorkerListingBlock'

const auth = getAuth()

function SavedListings() {
  const [currentUser, setCurrentUser] = useState()
  const [listings, setListings] = useState({})
  const [error, setError] = useState({})
  const [selectedWorker, setSelectedWorker] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoading(true)
        const config = {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
        const data = await axios.get(`/api/user/?email=${user.email}`, config)
        data && setLoading(false)
        setCurrentUser(data.data.user)
        console.log(`Bearer ${user.accessToken}`)
        setListings(data.data.user.savedListings)
      } else {
        window.location.href = '/'
      }
    })
  }, [auth])

  const showFullListing = (number, type) => {
    const worker = listings[type].filter((item) => item.workerNumber == number)
    setSelectedWorker(worker[0])
  }

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
          <div className={styles.saved}>
            {currentUser && currentUser.savedListings.length > 0 ? (
              <>
                <div className={styles.saved__listings}></div>

                <WorkerListingSide />
              </>
            ) : (
              <p className={styles.saved__listings__error}>
                You have not bookmarked any listings yet
              </p>
            )}
          </div>
        </main>
      </Layout>
    </div>
  )
}

export default SavedListings
