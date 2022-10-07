import React from 'react'
import styles from '../styles/CreateWorkerListing.module.scss'

function ListingHighlight() {
  return (
    <div>
      <div className={styles.create__inputs__input}>
        <label>Highlight</label>
        <input type='text' placeholder='Custom plumbing systems specialist' />
      </div>
    </div>
  )
}

export default ListingHighlight
