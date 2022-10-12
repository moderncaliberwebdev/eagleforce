import React, { useEffect, useState } from 'react'
import styles from '../styles/CreateWorkerListing.module.scss'

function ListingHighlight({ updateHighlightArray, index, valuesFromState }) {
  const [values, setValues] = useState(['', '', '', ''])

  useEffect(() => {
    valuesFromState &&
      valuesFromState.length > 0 &&
      setValues(valuesFromState[index])
  }, [valuesFromState])
  return (
    <div>
      <div className={styles.create__inputs__input}>
        <label>Highlight</label>
        <input
          type='text'
          placeholder='Custom plumbing systems specialist'
          onChange={(e) => updateHighlightArray(e.target.value, index)}
          value={values ? values : ''}
        />
      </div>
    </div>
  )
}

export default ListingHighlight
