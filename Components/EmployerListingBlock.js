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
  createObjectURL,
  logo,
  verified,
}) {
  return (
    <div
      className={`${styles.block} ${saved && styles.saved__block}`}
      onClick={() =>
        showFullListing && showFullListing(number, 'standardEmployers')
      }
    >
      <div className={styles.block__tags}>
        <div className={styles.block__tags__featured}></div>
        <div className={styles.block__tags__verified}>
          {verified && (
            <>
              <Image
                src='/images/post/verified-black.png'
                width={20}
                height={20}
              />
              <p>Verified Listing</p>
            </>
          )}
        </div>
      </div>
      <div className={styles.block__top}>
        <div>
          <Image
            src={
              logo && logo.length > 0
                ? `https://eagleforce-avatar.s3.amazonaws.com/${logo}`
                : createObjectURL
                ? createObjectURL
                : '/images/post/factory-black.png'
            }
            width='50'
            height='50'
            layout='fixed'
            objectFit='contain'
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
