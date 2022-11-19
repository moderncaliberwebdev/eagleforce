import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import Layout from '../../../Components/Layout'
import RichText from '../../../Components/RichText'
import EmployerBreadcrumbs from '../../../Components/EmployerBreadcrumbs'
import styles from '../../../styles/CreateEmployerListing.module.scss'
import Image from 'next/image'

function CreateEmployerListing({}) {
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
    '',
    '',
    '',
  ])

  useEffect(() => {
    const functionOnLoad = () => {
      if (!localStorage.getItem('planType')) {
        window.location.href = '/post/employer'
      } else {
        if (JSON.parse(localStorage.getItem('planType')).user == 'Worker') {
          window.location.href = '/post/worker'
        }
        if (localStorage.getItem('employerListingInfo')) {
          const parsedInfo = JSON.parse(
            localStorage.getItem('employerListingInfo')
          )

          setListingInfo(parsedInfo)
        } else
          localStorage.setItem(
            'employerListingInfo',
            JSON.stringify(listingInfo)
          )
      }
    }
    functionOnLoad()
  }, [])

  useEffect(() => {
    let listingInfoLength = 0
    listingInfo &&
      listingInfo.forEach((item) => (listingInfoLength += item.length))
    listingInfoLength > 0 &&
      localStorage.setItem('employerListingInfo', JSON.stringify(listingInfo))
  }, [listingInfo])

  const updateListingInfo = (element, value) => {
    const newState = listingInfo.map((obj, index) => {
      if (index == element) {
        return value
      }
      return obj
    })
    setListingInfo(newState)
  }

  const sendForm = () => {
    let allFilled = true

    for (let i = 0; i < listingInfo.length; i++) {
      if (listingInfo[i].length == 0 && i != 2) {
        allFilled = false
      }
    }

    const validatePhoneNumber = (input_str) => {
      var re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/

      return re.test(input_str)
    }

    if (!allFilled) {
      setErrorMsg('Please Fill in All Required Fields')
    } else if (validatePhoneNumber(listingInfo[12]) == false) {
      setErrorMsg('Please provide a valid phone number')
    } else {
      localStorage.setItem(
        'employerNumber',
        Math.floor(100000 + Math.random() * 900000)
      )
      window.location.href = '/post/employer/preview-listing'
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Employer Listing | Eagle Force Employment Services</title>
        <meta
          name='description'
          content='Fill in all the information regarding your desired position(s)'
        />
        <meta
          property='og:title'
          content='Create Employer Listing | Eagle Force Employment Services'
        />
        <meta
          property='og:description'
          content='Fill in all the information regarding your desired position(s)'
        />
        <meta
          property='og:url'
          content='https://www.eagleforceemploymentservices.com/post/employer/create-listing'
        />
        <meta property='og:type' content='website' />
        <link rel='icon' href='/images/layout/logo.png' />
      </Head>
      <Layout>
        <main>
          <h1>Create Employer Listing</h1>
          <EmployerBreadcrumbs />
          <div className={styles.create}>
            <div className={styles.create__desc}>
              <h2>Position Details</h2>
              <p>
                Fill in all the information regarding the position you&apos;re
                hiring for
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
                <label>Advertised Business Phone Number **</label>
                <input
                  type='text'
                  placeholder='717-111-111'
                  onChange={(e) => updateListingInfo(12, e.target.value)}
                  value={listingInfo ? listingInfo[12] : ''}
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
                <label>City (City of work location)**</label>
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
                Preview Listing
              </button>
              <p className={styles.create__inputs__error}>
                {errorMsg && errorMsg.length > 0 && errorMsg}
              </p>
            </div>
          </div>
        </main>
      </Layout>
    </div>
  )
}

export default CreateEmployerListing
