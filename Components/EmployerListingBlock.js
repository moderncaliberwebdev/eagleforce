import Image from 'next/image'
import React, { useState } from 'react'

import styles from '../styles/EmployerListingBlock.module.scss'

function EmployerListingBlock({
  job,
  number,
  company,
  type,
  employmentType,
  description,
  city,
  showFullListing,
  saved,
}) {
  return (
    <div
      className={`${styles.block} ${saved && styles.saved__block}`}
      onClick={() =>
        showFullListing && showFullListing(number, 'standardEmployers')
      }
    >
      <div className={styles.block__top}>
        <div>
          <Image
            src='/images/post/factory-black.png'
            width='50'
            height='50'
            layout='fixed'
          />
        </div>
        <div className={styles.block__top__titles}>
          <p>{job}</p>
          <p>{company}</p>
        </div>
      </div>
      <p className={styles.block__class}>
        {type == 'Both' ? 'Worker & Driver' : `${type} Only`}
      </p>
      <div className={styles.block__highlights}>
        <p>{city}</p>
        <p>
          {employmentType == 'Both Full Time & Part Time'
            ? 'Full & Part Time'
            : employmentType}
        </p>
      </div>
      <p
        className={styles.block__description}
        dangerouslySetInnerHTML={{ __html: description }}
      ></p>
    </div>
  )
}

export default EmployerListingBlock
