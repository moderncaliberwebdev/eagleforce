import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '../../../Components/Layout'
import WorkerBreadcrumbs from '../../../Components/WorkerBreadcrumbs'
import WorkerListingBlock from '../../../Components/WorkerListingBlock'
import FeaturedWorkerListingBlock from '../../../Components/FeaturedWorkerListingBlock'
import WorkerListingSide from '../../../Components/WorkerListingSide'
import styles from '../../../styles/PreviewWorkerListing.module.scss'

import clientPromise from '../../../utils/db'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'

import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import app from '../../../firebase/clientApp'

const auth = getAuth()

export async function getServerSideProps(context) {
  try {
    await clientPromise

    return {
      props: { isConnected: true },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }
}

function PreviewWorkerListing({ isConnected }) {
  const [listingInfo, setListingInfo] = useState()
  const [workerNumber, setWorkerNumber] = useState(0)
  const [currentUser, setCurrentUser] = useState()
  const [phone, setPhone] = useState('')
  const [planType, setPlanType] = useState({})
  const [discount, setDiscount] = useState('')
  const [useDiscount, setUseDiscount] = useState(false)

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid
        setCurrentUser(user)
        const config = {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }

        const userData = await axios.get(
          `/api/user?email=${user.email}`,
          config
        )
        setPhone(userData.data.user.phone)
        // ...
      } else {
        // User is signed out
        // ...
      }
    })
  }, [auth])

  useEffect(() => {
    const functionOnLoad = async () => {
      if (localStorage.getItem('listingInfo')) {
        const parsedInfo = JSON.parse(localStorage.getItem('listingInfo'))
        setListingInfo(parsedInfo)

        const number = JSON.parse(localStorage.getItem('workerNumber'))
        setWorkerNumber(number)

        const workerPlanType = JSON.parse(localStorage.getItem('planType'))

        setPlanType(workerPlanType)

        let allFilled = true

        for (let i = 0; i < parsedInfo.length - 2; i++) {
          if (parsedInfo[i].length == 0) {
            allFilled = false
          }
        }
        if (allFilled == false) {
          window.location.href = '/post/worker'
        }
      } else window.location.href = '/post/worker'
    }
    functionOnLoad()
  }, [])

  useEffect(() => {
    discount.replace(/\s+/g, '') == process.env.NEXT_PUBLIC_DISCOUNT
      ? setUseDiscount(true)
      : setUseDiscount(false)
  }, [discount])

  const getCoords = async () => {
    const data = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${listingInfo[6]},${listingInfo[7]}&key=${process.env.NEXT_PUBLIC_GEOCODE_API_KEY}`
    )

    return data.data.results[0].geometry.location
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Preview Worker Listing | Eagle Force Employment Services</title>
        <meta
          name='description'
          content='This is a preview of your worker listing. Switch back to Edit Listing if you  need to make changes'
        />
        <meta
          property='og:title'
          content='Preview Worker Listing | Eagle Force Employment Services'
        />
        <meta
          property='og:description'
          content='This is a preview of your worker listing. Switch back to Edit Listing if you  need to make changes'
        />
        <meta
          property='og:url'
          content='https://www.eagleforceemploymentservices.com/post/worker/preview-listing'
        />
        <meta property='og:type' content='website' />
        <link rel='icon' href='/images/layout/logo.png' />
      </Head>
      <Layout>
        <main className={styles.preview}>
          <h1>Purchase Worker Listing</h1>
          <WorkerBreadcrumbs />

          <p className={styles.preview__notice}>
            Click Pay with PayPal to purchase your listing and get it submitted
          </p>

          <p className={styles.preview__paypal}>
            We use PayPal Checkout for purchases, but you do not need a PayPal
            account to use this service
          </p>
          <div className={styles.preview__buttons}>
            <Link href='/post/worker/preview-listing' passHref>
              <a>Go Back to Preview</a>
            </Link>

            {planType.type && (
              <PayPalButton
                key={useDiscount}
                options={{
                  vault: true,
                  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT,
                  intent: 'subscription',
                }}
                createSubscription={(data, actions) => {
                  return actions.subscription.create({
                    plan_id: useDiscount
                      ? planType.type == 'Featured'
                        ? process.env.NEXT_PUBLIC_PAYPAL_FEATURED_PLAN_FREE
                        : planType.type == 'Standard' &&
                          process.env.NEXT_PUBLIC_PAYPAL_STANDARD_PLAN_FREE
                      : planType.type == 'Featured'
                      ? process.env.NEXT_PUBLIC_PAYPAL_FEATURED_PLAN
                      : planType.type == 'Standard' &&
                        process.env.NEXT_PUBLIC_PAYPAL_STANDARD_PLAN,
                  })
                }}
                style={{
                  layout: 'horizontal',
                  color: 'blue',
                  label: 'pay',
                }}
                onApprove={(data, actions) => {
                  // Capture the funds from the transaction
                  return actions.subscription
                    .get()
                    .then(async function (details) {
                      const getGeocode = await getCoords()

                      const config = {
                        headers: {
                          Authorization: `Bearer ${auth.currentUser.accessToken}`,
                        },
                      }
                      // OPTIONAL: Call your server to save the subscription
                      const post = await axios.post(
                        '/api/worker/create-listing',
                        {
                          listingInfo,
                          verified: false,
                          user: auth.currentUser.email.toLowerCase(),
                          listingType: planType.type,
                          userType: planType.user,
                          date: new Date().getTime(),
                          workerNumber,
                          orderID: data.orderID,
                          orderDetails: details,
                          geocode: getGeocode,
                          approved: false,
                          trial: useDiscount,
                          phone,
                        },
                        config
                      )

                      if (post) {
                        await axios.post('/api/new-user-email')
                        window.location.href = '/post/worker/verify-listing'
                        localStorage.clear()
                      }
                    })
                }}
              />
            )}
          </div>
          <div className={styles.preview__discount}>
            <p>Discount Code</p>
            <input
              type='text'
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </div>
        </main>
      </Layout>
    </div>
  )
}

export default PreviewWorkerListing
