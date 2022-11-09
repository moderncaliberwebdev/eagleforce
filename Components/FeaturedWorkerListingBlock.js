import Image from 'next/image'
import React from 'react'

import styles from '../styles/FeaturedWorkerListingBlock.module.scss'

function FeaturedWorkerListingBlock({
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
  return (
    <div
      className={`${styles.block} ${saved && styles.saved__block}`}
      onClick={() =>
        showFullListing && showFullListing(number, 'featuredWorkers')
      }
    >
      <div className={styles.block__tags}>
        <div className={styles.block__tags__featured}>Featured Listing</div>
        <div className={styles.block__tags__verified}>
          {verified && (
            <>
              <Image
                src='/images/post/verified-blue.png'
                width={20}
                height={20}
              />
              <p>Verified Listing</p>
              <div className={styles.block__tags__verified__help}>
                <Image
                  src='/images/post/help-blue.png'
                  width={20}
                  height={20}
                />
              </div>
              <div className={styles.block__tags__verified__tooltip}>
                Verified workers have been contacted by the site admin to verify
                their identity
              </div>
            </>
          )}
        </div>
      </div>
      <div className={styles.block__top}>
        <div>
          <Image
            src='/images/post/blue-worker-face.png'
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

export default FeaturedWorkerListingBlock
