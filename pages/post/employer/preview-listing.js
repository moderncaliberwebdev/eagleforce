import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '../../../Components/Layout'
import EmployerBreadcrumbs from '../../../Components/EmployerBreadcrumbs'
import EmployerListingBlock from '../../../Components/EmployerListingBlock'
import FeaturedEmployerListingBlock from '../../../Components/FeaturedEmployerListingBlock'
import EmployerListingSide from '../../../Components/EmployerListingSide'
import styles from '../../../styles/PreviewEmployerListing.module.scss'

import clientPromise from '../../../utils/db'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'

import { getAuth, onAuthStateChanged } from 'firebase/auth'
import app from '../../../firebase/clientApp'
import Image from 'next/image'

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

function PreviewEmployerListing() {
  const [listingInfo, setListingInfo] = useState()
  const [employerNumber, setEmployerNumber] = useState(0)
  const [currentUser, setCurrentUser] = useState()
  const [planType, setPlanType] = useState({})
  const [createObjectURL, setCreateObjectURL] = useState(null)
  const [imageError, setImageError] = useState('')

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
    console.log(createObjectURL)
  }, [createObjectURL])

  useEffect(() => {
    const functionOnLoad = async () => {
      if (localStorage.getItem('employerListingInfo')) {
        const parsedInfo = JSON.parse(
          localStorage.getItem('employerListingInfo')
        )
        setListingInfo(parsedInfo)

        const number = JSON.parse(localStorage.getItem('employerNumber'))
        setEmployerNumber(number)

        const employerPlanType = JSON.parse(localStorage.getItem('planType'))
        setPlanType(employerPlanType)

        let allFilled = true

        for (let i = 0; i < parsedInfo.length - 2; i++) {
          if (parsedInfo[i].length == 0 && i != 2) {
            allFilled = false
          }
        }
        if (allFilled == false) {
          window.location.href = '/post/employer'
        }
      } else window.location.href = '/post/employer'
    }
    functionOnLoad()
  }, [])

  const getCoords = async () => {
    const data = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${listingInfo[7]},${listingInfo[8]}&key=${process.env.NEXT_PUBLIC_GEOCODE_API_KEY}`
    )

    return data.data.results[0].geometry.location
  }

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0]
      if (i.size < 1600000) {
        setCreateObjectURL(URL.createObjectURL(i))
      } else setImageError('File must be less than 16MB')
    }
  }

  const uploadToServer = async () => {
    const event = document.getElementById('fileUpload')
    if (event.files && event.files[0]) {
      const i = event.files[0]
      if (i.size < 1600000) {
        const renameFile = (originalFile, newName) => {
          return new File([originalFile], newName, {
            type: originalFile.type,
            lastModified: originalFile.lastModified,
          })
        }
        const newName = renameFile(
          i,
          `${i.name.split('.')[0]}-${employerNumber}.${i.name.split('.')[1]}`
        )
        const body = new FormData()
        body.append('file', newName)

        const config = {
          headers: {
            'content-type': 'multipart/form-data',
          },
        }

        const uploadLogo = await axios.post('/api/employer/logo', body, config)
        if (uploadLogo) {
          return newName.name
        }
      } else setImageError('File must be less than 16MB')
    }
    return ''
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>
          Preview Employer Listing | Eagle Force Employment Services
        </title>
        <meta
          name='description'
          content='This is a preview of your employer listing. Switch back to Edit Listing if you  need to make changes'
        />
        <meta
          property='og:title'
          content='Preview Employer Listing | Eagle Force Employment Services'
        />
        <meta
          property='og:description'
          content='This is a preview of your Eeployer listing. Switch back to Edit Listing if you  need to make changes'
        />
        <meta
          property='og:url'
          content='https://www.eagleforceemploymentservices.com/post/employer/preview-listing'
        />
        <meta property='og:type' content='website' />
        <link rel='icon' href='/images/layout/logo.png' />
      </Head>
      <Layout>
        <main className={styles.preview}>
          <h1>Preview Employer Listing</h1>
          <EmployerBreadcrumbs />
          <p className={styles.preview__paypal}>
            We use PayPal Checkout for purchases, but you do not need a PayPal
            account to use this service
          </p>
          <div className={styles.preview__buttons}>
            <div>
              <Link href='/post/employer/create-listing' passHref>
                <a>Edit Listing</a>
              </Link>
            </div>
            <label>
              <input
                type='file'
                name='file'
                id='fileUpload'
                accept='image/x-png,image/gif,image/jpeg'
                onChange={uploadToClient}
              />
              Upload Logo
            </label>

            <PayPalButton
              options={{
                vault: true,
                'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT,
                intent: 'subscription',
              }}
              createSubscription={(data, actions) => {
                return actions.subscription.create({
                  plan_id:
                    planType.type == 'Featured'
                      ? process.env.NEXT_PUBLIC_PAYPAL_FEATURED_EMPLOYER_PLAN
                      : planType.type == 'Standard' &&
                        process.env.NEXT_PUBLIC_PAYPAL_STANDARD_EMPLOYER_PLAN,
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
                    const logoName = await uploadToServer()
                    const config = {
                      headers: {
                        Authorization: `Bearer ${auth.currentUser.accessToken}`,
                      },
                    }

                    const post = await axios.post(
                      '/api/employer/create-listing',
                      {
                        listingInfo,
                        verified: false,
                        user: auth.currentUser.email,
                        listingType: planType.type,
                        userType: planType.user,
                        date: new Date().getTime(),
                        employerNumber,
                        orderID: data.orderID,
                        orderDetails: details,
                        geocode: getGeocode,
                        logo: logoName,
                      },
                      config
                    )

                    if (post) {
                      window.location.href = '/profile'
                      localStorage.clear()
                    }
                  })
              }}
            />
          </div>
          {imageError && (
            <p className={styles.preview__imageerror}>{imageError}</p>
          )}
          <p className={styles.preview__notice}>
            This is a preview of your employer listing. Switch back to Edit
            Listing if you need to make changes
          </p>
          <div className={styles.preview__listing}>
            <div>
              {planType.type == 'Standard' ? (
                <EmployerListingBlock
                  job={listingInfo && listingInfo[0]}
                  number={employerNumber && employerNumber}
                  company={listingInfo && listingInfo[1]}
                  city={listingInfo && listingInfo[7]}
                  type={listingInfo && listingInfo[3]}
                  employmentType={listingInfo && listingInfo[6]}
                  description={listingInfo && listingInfo[10]}
                  createObjectURL={createObjectURL}
                />
              ) : (
                planType.type == 'Featured' && (
                  <FeaturedEmployerListingBlock
                    job={listingInfo && listingInfo[0]}
                    number={employerNumber && employerNumber}
                    company={listingInfo && listingInfo[1]}
                    city={listingInfo && listingInfo[7]}
                    type={listingInfo && listingInfo[3]}
                    employmentType={listingInfo && listingInfo[6]}
                    description={listingInfo && listingInfo[10]}
                    createObjectURL={createObjectURL}
                  />
                )
              )}
            </div>
            <div>
              <EmployerListingSide
                job={listingInfo && listingInfo[0]}
                number={employerNumber && employerNumber}
                company={listingInfo && listingInfo[1]}
                website={listingInfo && listingInfo[2]}
                type={listingInfo && listingInfo[3]}
                city={listingInfo && listingInfo[7]}
                employmentType={listingInfo && listingInfo[6]}
                description={listingInfo && listingInfo[10]}
                rateStart={listingInfo && listingInfo[4]}
                rateEnd={listingInfo && listingInfo[5]}
                experience={listingInfo && listingInfo[11]}
                createObjectURL={createObjectURL}
              />
            </div>
          </div>
        </main>
      </Layout>
    </div>
  )
}

export default PreviewEmployerListing
