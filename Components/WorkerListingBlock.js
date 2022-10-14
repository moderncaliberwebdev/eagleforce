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
}) {
  // const [rand, setRand] = useState(Math.floor(100000 + Math.random() * 900000))

  return (
    <div className={styles.block}>
      <div className={styles.block__top}>
        <div>
          <Image
            src='/images/post/worker-face.jpg'
            width='80'
            height='80'
            objectFit='fixed'
          />
        </div>
        <p>{jobs}</p>
      </div>
      <p className={styles.block__class}>
        Worker #12343 - {type == 'Both' ? 'Worker & Driver' : type}
      </p>
      <div className={styles.block__highlights}>
        <p>{city}, PA</p>
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
