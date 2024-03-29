import React, { useState, useEffect } from 'react'
import styles from '../styles/PreviousListing.module.scss'

import axios from 'axios'
import qs from 'qs'
import Popup from './Popup'

import { getAuth, onAuthStateChanged } from 'firebase/auth'
import app from '../firebase/clientApp'

const auth = getAuth()

function PreviousListing({ listing, currentUser, admin }) {
  const [authUser, setAuthUser] = useState()
  const [open, setOpen] = useState(false)
  const [openPopup, setOpenPopup] = useState(false)
  const [openRemovePopup, setOpenRemovePopup] = useState(false)
  const [openUpgradePopup, setOpenUpgradePopup] = useState(false)
  const [jobs, setJobs] = useState(1)
  const [jobArray, setJobArray] = useState([])
  const [highlights, setHighlights] = useState(1)
  const [highlightArray, setHighlightArray] = useState([])
  const [errorMsg, setErrorMsg] = useState('')
  const [listingInfo, setListingInfo] = useState([
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    [],
    [],
  ])

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setAuthUser(user)
      }
    })
  }, [auth])

  useEffect(() => {
    const functionsOnListingLoad = async () => {
      setListingInfo(listing.listingInfo)
      setJobs(
        listing.listingInfo[10].length && listing.listingInfo[10].length > 0
          ? listing.listingInfo[10].length
          : 1
      )
      setJobArray(listing.listingInfo[10])

      setHighlights(
        listing.listingInfo[11].length && listing.listingInfo[11].length > 0
          ? listing.listingInfo[11].length
          : 1
      )
      setHighlightArray(listing.listingInfo[11])
    }

    functionsOnListingLoad()
  }, [listing])

  useEffect(() => {
    const newState =
      listingInfo &&
      listingInfo.map((obj, index) => {
        if (index == 10 && jobArray.length > 0) {
          return jobArray
        }
        return obj
      })
    newState && setListingInfo(newState)
  }, [jobArray])

  useEffect(() => {
    const newState =
      listingInfo &&
      listingInfo.map((obj, index) => {
        if (index == 11 && highlightArray.length > 0) {
          return highlightArray
        }
        return obj
      })
    newState && setListingInfo(newState)
  }, [highlightArray])

  const cancelDelete = () => {
    setOpenPopup(false)
  }
  const cancelRemoveDelete = () => {
    setOpenRemovePopup(false)
  }
  const cancelUpgradeDelete = () => {
    setOpenUpgradePopup(false)
  }

  const renewListing = async () => {
    //get paypal token
    const basicAuth = `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT}:${process.env.NEXT_PUBLIC_PAYPAL_SECRET}`
    const qsData = qs.stringify({
      grant_type: 'client_credentials',
    })

    const tokenConfig = {
      headers: {
        'Content-Type': 'x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(basicAuth).toString('base64')}`,
      },
    }

    const paypalToken = await axios.post(
      `${process.env.NEXT_PUBLIC_PAYPAL_API_URL}/v1/oauth2/token`,
      qsData,
      tokenConfig
    )

    //return listing to database
    const config = {
      headers: { Authorization: `Bearer ${currentUser.accessToken}` },
    }
    const data = await axios.post(
      '/api/user/renew-listing',
      {
        email: currentUser.email,
        number: listing.workerNumber,
        type: 'Worker',
      },
      config
    )

    // renew listing on paypal
    if (data.data.newListing) {
      const activateConfig = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${paypalToken.data.access_token}`,
        },
      }
      const activateData = await axios.post(
        `${process.env.NEXT_PUBLIC_PAYPAL_API_URL}/v1/billing/subscriptions/${data.data.newListing.orderDetails.id}/activate`,
        {},
        activateConfig
      )
      activateData && window.location.reload()
    }
  }

  const approveListing = async () => {
    const config = {
      headers: { Authorization: `Bearer ${authUser.accessToken}` },
    }
    const data = await axios.put(
      `/api/user/approve-worker`,
      { number: listing.workerNumber },
      config
    )
    data && window.location.reload()
  }

  const verifyListing = async () => {
    const config = {
      headers: { Authorization: `Bearer ${authUser.accessToken}` },
    }
    const data = await axios.put(
      `/api/user/verify-worker`,
      { number: listing.workerNumber },
      config
    )
    data && window.location.reload()
  }

  const closeListing = async () => {
    //get paypal token
    const basicAuth = `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT}:${process.env.NEXT_PUBLIC_PAYPAL_SECRET}`
    const qsData = qs.stringify({
      grant_type: 'client_credentials',
    })

    const tokenConfig = {
      headers: {
        'Content-Type': 'x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(basicAuth).toString('base64')}`,
      },
    }

    const paypalToken = await axios.post(
      `${process.env.NEXT_PUBLIC_PAYPAL_API_URL}/v1/oauth2/token`,
      qsData,
      tokenConfig
    )

    //delete listing from database
    const config = {
      headers: { Authorization: `Bearer ${currentUser.accessToken}` },
    }
    const data = await axios.put(
      '/api/user/admin-close-listing',
      {
        email: listing.user,
        number: listing.workerNumber,
        admin: admin,
      },
      config
    )

    //pause listing on paypal
    if (data.data.worker) {
      const suspendConfig = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${paypalToken.data.access_token}`,
        },
      }
      const suspendData = await axios.post(
        `${process.env.NEXT_PUBLIC_PAYPAL_API_URL}/v1/billing/subscriptions/${data.data.worker.value.orderDetails.id}/suspend`,
        {},
        suspendConfig
      )
      suspendData && window.location.reload()
    }
  }

  const upgradeListing = async () => {
    //get paypal token
    const basicAuth = `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT}:${process.env.NEXT_PUBLIC_PAYPAL_SECRET}`
    const qsData = qs.stringify({
      grant_type: 'client_credentials',
    })

    const tokenConfig = {
      headers: {
        'Content-Type': 'x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(basicAuth).toString('base64')}`,
      },
    }

    const paypalToken = await axios.post(
      `${process.env.NEXT_PUBLIC_PAYPAL_API_URL}/v1/oauth2/token`,
      qsData,
      tokenConfig
    )

    //change trial to false in database
    const config = {
      headers: { Authorization: `Bearer ${currentUser.accessToken}` },
    }
    const data = await axios.put(
      '/api/user/admin-upgrade-listing',
      {
        email: listing.user,
        number: listing.workerNumber,
        admin: admin,
      },
      config
    )

    //upgrade paypal subscription
    if (data.data.worker) {
      const upgradeConfig = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${paypalToken.data.access_token}`,
        },
      }
      const upgradeData = await axios.post(
        `${process.env.NEXT_PUBLIC_PAYPAL_API_URL}/v1/billing/subscriptions/${data.data.worker.value.orderDetails.id}/revise`,
        {
          plan_id:
            listing.listingType == 'Featured'
              ? process.env.NEXT_PUBLIC_PAYPAL_FEATURED_PLAN
              : NEXT_PUBLIC_PAYPAL_STANDARD_PLAN,
        },
        upgradeConfig
      )
      upgradeData && window.location.reload()
    }
  }

  return (
    <div className={styles.blocks__block} key={listing._id}>
      <Popup
        question='Are you sure you want to reopen your listing?'
        desc='Your subscription will be renewed at at the same price as when you cancelled it'
        answer='Continue'
        no='Cancel'
        cancel={cancelDelete}
        next={renewListing}
        openPopup={openPopup}
        renew={true}
      />
      <Popup
        question='Are you sure you want to close this listing?'
        desc="The user's subscription will be cancelled. This action cannot be undone"
        answer='Continue'
        no='Cancel'
        cancel={cancelRemoveDelete}
        next={closeListing}
        openPopup={openRemovePopup}
      />
      <Popup
        question='Are you sure you want to upgrade this listing?'
        desc="The user's subscription will be upgraded. This action cannot be undone"
        answer='Continue'
        no='Cancel'
        cancel={cancelUpgradeDelete}
        next={upgradeListing}
        openPopup={openUpgradePopup}
        renew={true}
      />
      <div className={styles.blocks__block__info}>
        <h2>
          Worker #{listing.workerNumber} - {listing.listingInfo[0]}
        </h2>
        <div>
          {admin ? (
            <>
              {listing && !listing.approved ? (
                <button onClick={approveListing}>Approve</button>
              ) : (
                <p>Approved</p>
              )}
              {listing && !listing.verified ? (
                <button onClick={verifyListing}>Verify</button>
              ) : (
                <p>Verified</p>
              )}
              {listing && listing.trial && (
                <button onClick={() => setOpenUpgradePopup(true)}>
                  Upgrade
                </button>
              )}
              <button onClick={() => setOpenRemovePopup(true)}>Remove</button>
            </>
          ) : (
            <button onClick={() => setOpenPopup(true)}>Renew Listing</button>
          )}
        </div>
        <img
          src='/images/layout/arrow.png'
          alt='Dropdown Arrow'
          onClick={() => setOpen(!open)}
          style={{ transform: open && 'rotate(180deg)' }}
        />
      </div>
      {open && (
        <div className={styles.blocks__block__desc}>
          <div className={styles.blocks__block__desc__top}>
            <p>
              {listing.listingInfo[6]}, {listing.listingInfo[7]}
              {admin && (
                <>
                  <span>{listing.phone}</span>
                  <span>{listing.user}</span>
                </>
              )}
            </p>
          </div>
          <div className={styles.blocks__block__desc__details}>
            <h2>Details</h2>
            <div className={styles.blocks__block__desc__details__item}>
              <h3>Desired Hourly Rate</h3>
              <p>
                ${listing.listingInfo[3]} - ${listing.listingInfo[4]}
              </p>
            </div>
            <div className={styles.blocks__block__desc__details__item}>
              <h3>Desired Employment Type</h3>
              <p>{listing.listingInfo[5]}</p>
            </div>
            <div className={styles.blocks__block__desc__details__item}>
              <h3>Skill Level</h3>
              <p>{listing.listingInfo[1]}</p>
            </div>
          </div>
          <div className={styles.blocks__block__desc__desc}>
            <h2>Description</h2>
            <p
              className={styles.blocks__block__desc__desc__summary}
              dangerouslySetInnerHTML={{ __html: listing.listingInfo[9] }}
            ></p>
            {listing.listingInfo[10] &&
              listing.listingInfo[10][0] &&
              listing.listingInfo[10][0].length > 0 && (
                <div className={styles.blocks__block__desc__desc__jobs}>
                  <h2>Work Experience</h2>
                  {listing.listingInfo[10].map((job) => (
                    <div
                      key={job[0]}
                      className={styles.blocks__block__desc__desc__jobs__job}
                    >
                      <p>
                        Job Title: <span>{job[0]}</span>
                      </p>
                      <p>
                        Company Name: <span>{job[1]}</span>
                      </p>
                      <p>
                        Time Period: <span>{job[2]}</span>
                      </p>
                      <p>Responsibilities:</p>
                      <p>
                        <span
                          dangerouslySetInnerHTML={{ __html: job[3] }}
                        ></span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            {listing.listingInfo[11] && listing.listingInfo[11].length > 0 && (
              <div className={styles.blocks__block__desc__desc__jobs}>
                <h2>Highlights</h2>
                {listing.listingInfo[11].map((highlight) => (
                  <p dangerouslySetInnerHTML={{ __html: highlight }}></p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PreviousListing
