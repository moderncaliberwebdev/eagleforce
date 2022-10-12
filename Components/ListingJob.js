import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import styles from '../styles/CreateWorkerListing.module.scss'
import RichText from './RichText'

function ListingJob({ updateJobArray, index, valuesFromState, removeJob }) {
  const [values, setValues] = useState(['', '', '', ''])

  useEffect(() => {
    valuesFromState &&
      valuesFromState.length > 0 &&
      setValues(valuesFromState[index])
  }, [valuesFromState])

  const updateJobInfo = (element, value) => {
    const newState = values.map((obj, i) => {
      if (i == element) {
        return value
      }
      return obj
    })

    setValues(newState)
    updateJobArray(newState, index)
  }

  return (
    <div style={{ marginBottom: '4rem' }}>
      <div className={styles.create__inputs__input}>
        <label>
          <p>Job Title</p>
          {valuesFromState && valuesFromState.length > 1 && (
            <div
              className={styles.create__input__inputs__remove}
              onClick={() => removeJob(values)}
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
          placeholder='Residential Plumber'
          onChange={(e) => updateJobInfo(0, e.target.value)}
          value={values ? values[0] : ''}
        />
      </div>
      <div className={styles.create__inputs__input}>
        <label>Company Worked For</label>
        <input
          type='text'
          placeholder='Lancaster Plumbing, Heating, Cooling & Electrical'
          onChange={(e) => updateJobInfo(1, e.target.value)}
          value={values ? values[1] : ''}
        />
      </div>
      <div className={styles.create__inputs__input}>
        <label>Time Period</label>
        <input
          type='text'
          placeholder='2015 -  Current'
          onChange={(e) => updateJobInfo(2, e.target.value)}
          value={values ? values[2] : ''}
        />
      </div>
      <div className={styles.create__inputs__input}>
        <label>Describe Your Responsibilites There</label>
        <RichText
          updateJobInfo={updateJobInfo}
          textHTML={values && values[3]}
        />
      </div>
    </div>
  )
}

export default ListingJob
