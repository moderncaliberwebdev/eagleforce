import React from 'react'
import styles from '../styles/CreateWorkerListing.module.scss'

function ListingHighlight({ updateHighlightArray, index }) {
  return (
    <div>
      <div className={styles.create__inputs__input}>
        <label>Highlight</label>
        <input
          type='text'
          placeholder='Custom plumbing systems specialist'
          onChange={(e) => updateHighlightArray(e.target.value, index)}
        />
      </div>
    </div>
  )
}

export default ListingHighlight
