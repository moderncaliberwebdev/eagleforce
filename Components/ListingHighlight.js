import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import styles from '../styles/CreateWorkerListing.module.scss'

function ListingHighlight({
  updateHighlightArray,
  index,
  valuesFromState,
  removeHighlight,
}) {
  const [values, setValues] = useState('')

  useEffect(() => {
    valuesFromState &&
      valuesFromState.length > 0 &&
      setValues(valuesFromState[index])
  }, [valuesFromState])
  return (
    <div>
      <div className={styles.create__inputs__input}>
        <label>
          <p>Highlight</p>
          {valuesFromState && valuesFromState.length > 1 && (
            <div
              className={styles.create__input__inputs__remove}
              onClick={() => removeHighlight(values)}
            >
              <p>Remove This Job</p>
              <Image
                src='/images/post/blue-minus.png'
                width='20'
                height='20'
                objectFit={'fixed'}
              />
            </div>
          )}
        </label>
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
