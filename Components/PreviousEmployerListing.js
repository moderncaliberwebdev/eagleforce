import React, { useState, useEffect } from 'react'
import styles from '../styles/PreviousEmployerListing.module.scss'

import axios from 'axios'
import qs from 'qs'
import Popup from './Popup'

import { getAuth, onAuthStateChanged } from 'firebase/auth'
import app from '../firebase/clientApp'
import Image from 'next/image'
import Link from 'next/link'

const auth = getAuth()

function PreviousListing({ listing, currentUser, admin }) {
  const [open, setOpen] = useState(false)
  const [openPopup, setOpenPopup] = useState(false)
  const [openRemovePopup, setOpenRemovePopup] = useState(false)
  const [openUpgradePopup, setOpenUpgradePopup] = useState(false)
  const [authUser, setAuthUser] = useState()

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setAuthUser(user)
      }
    })
  }, [auth])

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
        number: listing.employerNumber,
        type: 'Employer',
      },
      config
    )
    console.log(data)

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
    console.log('approving listing')
    const config = {
      headers: { Authorization: `Bearer ${authUser.accessToken}` },
    }
    const data = await axios.put(
      `/api/user/approve-employer`,
      { number: listing.employerNumber },
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
    console.log(currentUser.accessToken, admin)
    const data = await axios.put(
      '/api/user/admin-close-employer-listing',
      {
        email: listing.user,
        number: listing.employerNumber,
        admin: admin,
      },
      config
    )

    //pause listing on paypal
    if (data.data.employer) {
      const suspendConfig = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${paypalToken.data.access_token}`,
        },
      }
      const suspendData = await axios.post(
        `${process.env.NEXT_PUBLIC_PAYPAL_API_URL}/v1/billing/subscriptions/${data.data.employer.value.orderDetails.id}/suspend`,
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
      '/api/user/admin-upgrade-employer-listing',
      {
        email: listing.user,
        number: listing.employerNumber,
        admin: listing.admin,
      },
      config
    )

    //upgrade paypal subscription
    if (data.data.employer) {
      const upgradeConfig = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${paypalToken.data.access_token}`,
        },
      }
      const upgradeData = await axios.post(
        `${process.env.NEXT_PUBLIC_PAYPAL_API_URL}/v1/billing/subscriptions/${data.data.employer.value.orderDetails.id}/revise`,
        {
          plan_id:
            listing.listingType == 'Featured'
              ? process.env.NEXT_PUBLIC_PAYPAL_FEATURED_EMPLOYER_PLAN
              : NEXT_PUBLIC_PAYPAL_STANDARD_EMPLOYER_PLAN,
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
        color='red'
        renew={true}
      />
      <Popup
        question='Are you sure you want to close this listing?'
        desc="The user's subscription will be cancelled. This action cannot be undone"
        answer='Continue'
        no='Cancel'
        cancel={cancelRemoveDelete}
        next={closeListing}
        color='red'
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
        color='red'
        renew={true}
      />
      <div className={styles.blocks__block__info}>
        <h2>
          {listing.logo && listing.logo.length > 0 && (
            <Image
              src={`https://eagleforce-avatar.s3.amazonaws.com/${listing.logo}`}
              width={50}
              height={50}
              objectFit='contain'
            />
          )}
          {listing.listingInfo[1]} - {listing.listingInfo[0]}
        </h2>
        <div>
          {admin ? (
            <>
              {listing && !listing.approved ? (
                <button onClick={approveListing}>Approve</button>
              ) : (
                <p>Approved</p>
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
              {listing.listingInfo[7]}, {listing.listingInfo[8]}
              {admin && (
                <>
                  <span>{listing.phone}</span>
                  <span>{listing.user}</span>
                  <Link passHref href={listing.listingInfo[2]}>
                    <a target='_blank'>{listing.listingInfo[2]}</a>
                  </Link>
                </>
              )}
            </p>
          </div>
          <div className={styles.blocks__block__desc__details}>
            <h2>Details</h2>
            <div className={styles.blocks__block__desc__details__item}>
              <h3>Desired Hourly Rate</h3>
              <p>
                ${listing.listingInfo[4]} - ${listing.listingInfo[5]}
              </p>
            </div>
            <div className={styles.blocks__block__desc__details__item}>
              <h3>Desired Employment Type</h3>
              <p>{listing.listingInfo[6]}</p>
            </div>
          </div>
          <div className={styles.blocks__block__desc__desc}>
            <h2>Job Description</h2>
            <p
              className={styles.blocks__block__desc__desc__summary}
              dangerouslySetInnerHTML={{ __html: listing.listingInfo[10] }}
            ></p>
            <h2>Qualifications</h2>
            <p
              className={styles.blocks__block__desc__desc__summary}
              dangerouslySetInnerHTML={{ __html: listing.listingInfo[11] }}
            ></p>
          </div>
        </div>
      )}
    </div>
  )
}

export default PreviousListing
