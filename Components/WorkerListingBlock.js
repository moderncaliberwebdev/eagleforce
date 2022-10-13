import Image from 'next/image'
import React from 'react'

import styles from '../styles/WorkerListingBlock.module.scss'

function WorkerListingBlock() {
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
        <p>Residential Plumber, Plumbing Technician</p>
      </div>
      <p className={styles.block__class}>Worker #10483 - Worker Only</p>
      <div className={styles.block__highlights}>
        <p>Lancaster, PA</p>
        <p>Full Time</p>
        <p>Expert</p>
      </div>
      <p className={styles.block__description}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
        mollitia, molestiae quas vel sint commodi repudiandae consequuntur
        voluptatum laborum Lorem ipsum dolor sit amet consectetur adipisicing
        elit. Maxime mollitia, molestiae quas vel voluptatum laborum Lorem ipsum
        dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae
        quas vel voluptatum laborum Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Maxime mollitia, molestiae quas vel
      </p>
    </div>
  )
}

export default WorkerListingBlock
