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
  const [planType, setPlanType] = useState({})

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid
        setCurrentUser(user)
        // ...
      } else {
        // User is signed out
        // ...
      }
    })
  }, [auth])

  useEffect(() => {
    const functionOnLoad = () => {
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
          <h1>Preview Worker Listing</h1>
          <WorkerBreadcrumbs />
          <p className={styles.preview__paypal}>
            We use PayPal Checkout for purchases, but you do not need a PayPal
            account to use this service
          </p>
          <div className={styles.preview__buttons}>
            <div>
              <Link href='/post/worker/create-listing' passHref>
                <a>Edit Listing</a>
              </Link>
            </div>
            {planType && planType.type == 'Featured' ? (
              <PayPalButton
                options={{
                  vault: true,
                  'client-id':
                    'Aa0y7UQRO1_M92AM5jsJuHdHonnn9o_xGpQsxNH1FfDAlyhr7nJhgbWrArEr67utB3ZUxis2CJZb41mO',
                }}
                createSubscription={(data, actions) => {
                  return actions.subscription.create({
                    plan_id: 'P-3B724015PB648072WMNG3MZY',
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
                          user: auth.currentUser.email,
                          listingType: planType.type,
                          userType: planType.user,
                          date: new Date().getTime(),
                          workerNumber,
                          orderID: data.orderID,
                          orderDetails: details,
                        },
                        config
                      )

                      if (post) {
                        window.location.href = '/post/worker/verify-listing'
                        localStorage.clear()
                      }
                    })
                }}
              />
            ) : (
              planType.type == 'Standard' && (
                <PayPalButton
                  options={{
                    vault: true,
                    'client-id':
                      'Aa0y7UQRO1_M92AM5jsJuHdHonnn9o_xGpQsxNH1FfDAlyhr7nJhgbWrArEr67utB3ZUxis2CJZb41mO',
                  }}
                  createSubscription={(data, actions) => {
                    return actions.subscription.create({
                      plan_id: 'P-3H207100FH963184YMNMCCBA',
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
                            user: auth.currentUser.email,
                            listingType: planType.type,
                            userType: planType.user,
                            date: new Date().getTime(),
                            workerNumber,
                            orderID: data.orderID,
                            orderDetails: details,
                          },
                          config
                        )

                        if (post) {
                          window.location.href = '/post/worker/verify-listing'
                          localStorage.clear()
                        }
                      })
                  }}
                />
              )
            )}
          </div>
          <p className={styles.preview__notice}>
            This is a preview of your worker listing. Switch back to Edit
            Listing if you need to make changes
          </p>
          <div className={styles.preview__listing}>
            <div>
              {planType.type == 'Standard' ? (
                <WorkerListingBlock
                  jobs={listingInfo && listingInfo[0]}
                  number={workerNumber && workerNumber}
                  type={listingInfo && listingInfo[2]}
                  city={listingInfo && listingInfo[6]}
                  employmentType={listingInfo && listingInfo[5]}
                  skill={listingInfo && listingInfo[1]}
                  summary={listingInfo && listingInfo[9]}
                />
              ) : (
                planType.type == 'Featured' && (
                  <FeaturedWorkerListingBlock
                    jobs={listingInfo && listingInfo[0]}
                    number={workerNumber && workerNumber}
                    type={listingInfo && listingInfo[2]}
                    city={listingInfo && listingInfo[6]}
                    employmentType={listingInfo && listingInfo[5]}
                    skill={listingInfo && listingInfo[1]}
                    summary={listingInfo && listingInfo[9]}
                  />
                )
              )}
            </div>
            <div>
              <WorkerListingSide
                jobs={listingInfo && listingInfo[0]}
                number={workerNumber && workerNumber}
                type={listingInfo && listingInfo[2]}
                city={listingInfo && listingInfo[6]}
                employmentType={listingInfo && listingInfo[5]}
                skill={listingInfo && listingInfo[1]}
                summary={listingInfo && listingInfo[9]}
                rateStart={listingInfo && listingInfo[3]}
                rateEnd={listingInfo && listingInfo[4]}
                experience={listingInfo && listingInfo[10]}
                highlights={listingInfo && listingInfo[11]}
              />
            </div>
          </div>
        </main>
      </Layout>
    </div>
  )
}

export default PreviewWorkerListing
