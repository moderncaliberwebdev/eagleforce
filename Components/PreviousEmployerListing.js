import React, { useState, useEffect } from 'react'
import styles from '../styles/PreviousEmployerListing.module.scss'

import axios from 'axios'
import qs from 'qs'
import Popup from './Popup'

function PreviousListing({ listing, currentUser }) {
  const [open, setOpen] = useState(false)
  const [openPopup, setOpenPopup] = useState(false)
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
    setListingInfo(listing.listingInfo)
  }, [listing])

  const cancelDelete = () => {
    setOpenPopup(false)
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
      'https://api-m.paypal.com/v1/oauth2/token',
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
        `https://api-m.paypal.com/v1/billing/subscriptions/${data.data.newListing.orderDetails.id}/activate`,
        {},
        activateConfig
      )
      activateData && window.location.reload()
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
      <div className={styles.blocks__block__info}>
        <h2>
          {listing.listingInfo[1]} - {listing.listingInfo[0]}
        </h2>
        <button onClick={() => setOpenPopup(true)}>Renew Listing</button>
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
