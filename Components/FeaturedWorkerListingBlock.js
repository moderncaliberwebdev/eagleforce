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
}) {
  return (
    <div className={styles.block}>
      <div className={styles.block__top}>
        <div>
          <Image
            src='/images/post/blue-worker-face.png'
            width='80'
            height='80'
            objectFit='fixed'
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
