import React, { useState } from 'react'
import styles from '../styles/CreateWorkerListing.module.scss'
import RichText from './RichText'

function ListingJob({ updateJobArray, index }) {
  const [values, setValues] = useState(['', '', '', ''])

  const updateJobInfo = (element, value) => {
    const newState = values.map((obj, i) => {
      // 👇️ if id equals 2, update country property
      if (i == element) {
        return value
      }

      // 👇️ otherwise return object as is
      return obj
    })

    setValues(newState)
    updateJobArray(newState, index)
  }

  return (
    <div style={{ marginBottom: '4rem' }}>
      <div className={styles.create__inputs__input}>
        <label>Job Title</label>
        <input
          type='text'
          placeholder='Residential Plumber'
          onChange={(e) => updateJobInfo(0, e.target.value)}
        />
      </div>
      <div className={styles.create__inputs__input}>
        <label>Company Worked For</label>
        <input
          type='text'
          placeholder='Lancaster Plumbing, Heating, Cooling & Electrical'
          onChange={(e) => updateJobInfo(1, e.target.value)}
        />
      </div>
      <div className={styles.create__inputs__input}>
        <label>Time Period</label>
        <input
          type='text'
          placeholder='2015 -  Current'
          onChange={(e) => updateJobInfo(2, e.target.value)}
        />
      </div>
      <div className={styles.create__inputs__input}>
        <label>Describe Your Responsibilites There</label>
        <RichText updateJobInfo={updateJobInfo} />
      </div>
    </div>
  )
}

export default ListingJob
