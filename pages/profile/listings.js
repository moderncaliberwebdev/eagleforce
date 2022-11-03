import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import Layout from '../../Components/Layout'
import styles from '../../styles/YourListings.module.scss'

import ProfileBreadcrumbs from '../../Components/ProfileBreadcrumbs'
import YourListing from '../../Components/YourListing'
import YourEmployerListing from '../../Components/YourEmployerListing'
import PreviousListing from '../../Components/PreviousListing'
import PreviousEmployerListing from '../../Components/PreviousEmployerListing'

import { getAuth, onAuthStateChanged } from 'firebase/auth'
import app from '../../firebase/clientApp'
import axios from 'axios'

const auth = getAuth()

function Listings() {
  const [currentUser, setCurrentUser] = useState()
  const [listings, setListings] = useState()
  const [employerListings, setEmployerListings] = useState()
  const [previousListings, setPreviousListings] = useState()
  const [listingType, setListingType] = useState(true)
  const [loading, setLoading] = useState(true)

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
        data && setLoading(false)
        setPreviousListings(
          JSON.parse(JSON.stringify(data.data.previousListings))
        )
        setListings(JSON.parse(JSON.stringify(data.data.docs)))
        setEmployerListings(JSON.parse(JSON.stringify(data.data.employerDocs)))
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
            <p
              style={{ textDecoration: listingType == true && 'underline' }}
              onClick={() => setListingType(true)}
            >
              Current Listings (
              {listings && listings.length + employerListings.length})
            </p>
            <p
              style={{ textDecoration: listingType == false && 'underline' }}
              onClick={() => setListingType(false)}
            >
              Previous Listings ({previousListings && previousListings.length})
            </p>
          </div>
          <div className={styles.blocks}>
            {loading && (
              <p className={styles.blocks__loading}>Loading Listings...</p>
            )}
            {listings &&
              listingType &&
              listings.map((listing) => (
                <YourListing
                  listing={listing}
                  key={listing._id}
                  currentUser={currentUser}
                />
              ))}
            {employerListings &&
              listingType &&
              employerListings.map((listing, index) => (
                <YourEmployerListing
                  listing={listing}
                  key={listing._id}
                  currentUser={currentUser}
                  index={index}
                />
              ))}
            {previousListings &&
              !listingType &&
              previousListings.map((listing) => (
                <>
                  {listing.userType == 'Worker' ? (
                    <PreviousListing
                      listing={listing}
                      key={listing._id}
                      currentUser={currentUser}
                    />
                  ) : (
                    <PreviousEmployerListing
                      listing={listing}
                      key={listing._id}
                      currentUser={currentUser}
                    />
                  )}
                </>
              ))}
          </div>
        </main>
      </Layout>
    </div>
  )
}

export default Listings
