import React from 'react'
import styles from '../styles/CreateWorkerListing.module.scss'
import RichText from './RichText'

function ListingJob() {
  return (
    <div style={{ marginBottom: '4rem' }}>
      <div className={styles.create__inputs__input}>
        <label>Job Title</label>
        <input type='text' placeholder='Residential Plumber' />
      </div>
      <div className={styles.create__inputs__input}>
        <label>Company Worked For</label>
        <input
          type='text'
          placeholder='Lancaster Plumbing, Heating, Cooling & Electrical'
        />
      </div>
      <div className={styles.create__inputs__input}>
        <label>Time Period</label>
        <input type='text' placeholder='2015 -  Current' />
      </div>
      <div className={styles.create__inputs__input}>
        <label>Describe Your Responsibilites There</label>
        <RichText />
      </div>
    </div>
  )
}

export default ListingJob
