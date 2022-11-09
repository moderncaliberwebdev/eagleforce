import Image from 'next/image'
import React, { useState } from 'react'

import styles from '../styles/WorkerListingBlock.module.scss'

function WorkerListingBlock({
  jobs,
  number,
  type,
  city,
  employmentType,
  skill,
  summary,
  showFullListing,
  saved,
  verified,
}) {
  // const [rand, setRand] = useState(Math.floor(100000 + Math.random() * 900000))

  return (
    <div
      className={`${styles.block} ${saved && styles.saved__block}`}
      onClick={() =>
        showFullListing && showFullListing(number, 'standardWorkers')
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
              <div className={styles.block__tags__verified__help}>
                <Image
                  src='/images/post/help-black.png'
                  width={20}
                  height={20}
                />
              </div>
              <div className={styles.block__tags__verified__tooltip}>
                Owners of verified listings have had their identity and listing
                examined and verified
              </div>
            </>
          )}
        </div>
      </div>
      <div className={styles.block__top}>
        <div>
          <Image
            src='/images/post/worker-face.jpg'
            width='50'
            height='50'
            layout='fixed'
          />
        </div>
        <p>{jobs}</p>
      </div>
      <p className={styles.block__class}>
        Worker #{number} - {type == 'Both' ? 'Worker & Driver' : type}
      </p>
      <div className={styles.block__highlights}>
        <p>{skill}</p>
        <p>{employmentType}</p>
      </div>
      <p
        className={styles.block__description}
        dangerouslySetInnerHTML={{ __html: summary }}
      ></p>
    </div>
  )
}

export default WorkerListingBlock
