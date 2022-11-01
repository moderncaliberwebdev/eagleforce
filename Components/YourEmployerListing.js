import React, { useState, useEffect } from 'react'
import styles from '../styles/YourEmployerListing.module.scss'
import RichText from '../Components/RichText'
import Image from 'next/image'
import ListingJob from './ListingJob'
import ListingHighlight from './ListingHighlight'
import axios from 'axios'
import qs from 'qs'
import Link from 'next/link'
import Popup from './Popup'

function YourEmployerListing({ listing, currentUser }) {
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

  const updateListingInfo = (element, value) => {
    const newState = listingInfo.map((obj, index) => {
      if (index == element) {
        return value
      }
      return obj
    })
    setListingInfo(newState)
  }

  const sendForm = async () => {
    let allFilled = true

    for (let i = 0; i < listingInfo.length; i++) {
      if (listingInfo[i].length == 0 && i != 2) {
        allFilled = false
      }
    }

    if (!allFilled) {
      setErrorMsg('Please Fill in All Required Fields')
    } else {
      setErrorMsg('')
      const config = {
        headers: { Authorization: `Bearer ${currentUser.accessToken}` },
      }
      const data = await axios.put(
        '/api/employer/update-listing',
        {
          email: currentUser.email,
          listingInfo,
          number: listing.employerNumber,
        },
        config
      )

      data && window.location.reload()
    }
  }

  const cancelDelete = () => {
    setOpenPopup(false)
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
      'https://api-m.paypal.com/v1/oauth2/token',
      qsData,
      tokenConfig
    )

    //delete listing from database
    const config = {
      headers: { Authorization: `Bearer ${currentUser.accessToken}` },
    }
    const data = await axios.put(
      '/api/user/close-employer-listing',
      {
        email: currentUser.email,
        number: listing.employerNumber,
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
        `https://api-m.paypal.com/v1/billing/subscriptions/${data.data.employer.value.orderDetails.id}/suspend`,
        {},
        suspendConfig
      )
      suspendData && window.location.reload()
    }
  }

  return (
    <div className={styles.blocks__block} key={listing._id}>
      <Popup
        question='Are you sure you want to close your listing?'
        desc='Your subscription will be cancelled. This action can be undone by going to the Previous Listings tab in the Listings section of your profile.'
        answer='Continue'
        no='Cancel'
        cancel={cancelDelete}
        next={closeListing}
        openPopup={openPopup}
        color='red'
      />
      <div className={styles.blocks__block__info}>
        <h2>
          {listing.listingInfo[1]} - {listing.listingInfo[0]}
        </h2>

        <button onClick={() => setOpenPopup(true)}>Close Listing</button>
        <img
          src='/images/layout/arrow.png'
          alt='Dropdown Arrow'
          onClick={() => setOpen(!open)}
          style={{ transform: open && 'rotate(180deg)' }}
        />
      </div>
      {open && (
        <div className={styles.blocks__block__create}>
          <div className={styles.create}>
            <div className={styles.create__desc}>
              <h2>Position Details</h2>
              <p>
                Fill in all the information regarding the position you're hiring
                for
              </p>
            </div>
            <div className={styles.create__inputs}>
              <div className={styles.create__inputs__input}>
                <label>Position Hiring For **</label>
                <input
                  type='text'
                  placeholder='Residential Plumber'
                  onChange={(e) => updateListingInfo(0, e.target.value)}
                  value={listingInfo ? listingInfo[0] : ''}
                />
              </div>
              <div className={styles.create__inputs__input}>
                <label>Business Name **</label>
                <input
                  type='text'
                  placeholder='Eagle Force'
                  onChange={(e) => updateListingInfo(1, e.target.value)}
                  value={listingInfo ? listingInfo[1] : ''}
                />
              </div>
              <div className={styles.create__inputs__input}>
                <label>Website URL (if you have one)</label>
                <input
                  type='text'
                  placeholder='https://padutchbuilders.com'
                  onChange={(e) => updateListingInfo(2, e.target.value)}
                  value={listingInfo ? listingInfo[2] : ''}
                />
              </div>

              <div className={styles.create__inputs__input}>
                <label>Worker Type **</label>
                <select
                  required
                  onChange={(e) => updateListingInfo(3, e.target.value)}
                  value={listingInfo ? listingInfo[3] : ''}
                >
                  <option value='' disabled selected hidden>
                    Pick Worker Type
                  </option>
                  <option value='Worker'>Worker</option>
                  <option value='Crew Driver'>Crew Driver</option>
                  <option value='Both'>Both</option>
                </select>
              </div>
              <div className={styles.create__inputs__input}>
                <label>Desired Hourly Rate **</label>
                <div className={styles.create__inputs__input__rate}>
                  <p>$</p>
                  <input
                    type='text'
                    placeholder='20'
                    onChange={(e) => updateListingInfo(4, e.target.value)}
                    value={listingInfo ? listingInfo[4] : ''}
                  />
                  <p className={styles.create__inputs__input__rate__to}>to</p>
                  <p>$</p>
                  <input
                    type='text'
                    placeholder='30'
                    onChange={(e) => updateListingInfo(5, e.target.value)}
                    value={listingInfo ? listingInfo[5] : ''}
                  />
                </div>
              </div>
              <div className={styles.create__inputs__input}>
                <label>Desired Employment Type **</label>
                <select
                  required
                  onChange={(e) => updateListingInfo(6, e.target.value)}
                  value={listingInfo ? listingInfo[6] : ''}
                >
                  <option value='' disabled selected hidden>
                    Pick Employment Type
                  </option>
                  <option value='Full Time'>Full Time</option>
                  <option value='Part Time'>Part Time</option>
                  <option value='Both Full Time & Part Time'>
                    Both Full Time & Part Time
                  </option>
                  <option value='Contract'>Contract</option>
                </select>
              </div>
              <div className={styles.create__inputs__input}>
                <label>City **</label>
                <input
                  type='text'
                  placeholder='Lancaster'
                  onChange={(e) => updateListingInfo(7, e.target.value)}
                  value={listingInfo ? listingInfo[7] : ''}
                />
              </div>
              <div className={styles.create__inputs__input}>
                <label>State **</label>
                <select
                  required
                  onChange={(e) => updateListingInfo(8, e.target.value)}
                  value={listingInfo ? listingInfo[8] : ''}
                >
                  <option value='' disabled selected hidden>
                    Pick State
                  </option>
                  <option value='Pennsylvania'>Pennsylvania</option>
                </select>
              </div>
              <div className={styles.create__inputs__input}>
                <label>
                  How did you find out about Eagle Force Employment Services? **
                </label>
                <input
                  type='text'
                  onChange={(e) => updateListingInfo(9, e.target.value)}
                  value={listingInfo ? listingInfo[9] : ''}
                />
              </div>
            </div>
          </div>
          <div className={styles.create}>
            <div className={styles.create__desc}>
              <h2>Job Description</h2>
              <p>Summarize the job. Include duties, schedule and benefits </p>
            </div>
            <div className={styles.create__inputs}>
              <div className={styles.create__inputs__input}>
                <label>Description **</label>
                <RichText
                  updateEmployerListingInfo={updateListingInfo}
                  richText={10}
                  textHTML={listingInfo ? listingInfo[10] : ''}
                />
              </div>
            </div>
          </div>
          <div className={styles.create}>
            <div className={styles.create__desc}>
              <h2>Qualifications</h2>
              <p>
                Highlight the qualifications for position. Include any
                education, experience, or licenses/certifications required for
                the job
              </p>
            </div>
            <div className={styles.create__inputs}>
              <div className={styles.create__inputs__input}>
                <label>Description **</label>
                <RichText
                  updateEmployerListingInfo={updateListingInfo}
                  richText={11}
                  textHTML={listingInfo ? listingInfo[11] : ''}
                />
              </div>
              <p className={styles.create__inputs__disclaimer}>
                ** - Required Field
              </p>
              <button
                className={styles.create__inputs__preview}
                onClick={sendForm}
              >
                Update Listing
              </button>
              <p className={styles.create__inputs__error}>
                {errorMsg && errorMsg.length > 0 && errorMsg}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default YourEmployerListing
