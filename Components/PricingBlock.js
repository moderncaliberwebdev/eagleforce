import Link from 'next/link'
import React from 'react'
import styles from '../styles/PricingBlock.module.scss'

function PricingBlock({
  background,
  backgroundLight,
  color,
  type,
  price,
  occurance,
  features,
}) {
  return (
    <div
      className={styles.block}
      style={{ color: color, backgroundColor: background }}
    >
      <h2>{type} Listing</h2>
      <h3>
        ${price} / {occurance}
      </h3>
      <div className={styles.block__features}>
        {features &&
          features.map((feature) => (
            <div className={styles.block__features__item} key={feature}>
              <div
                className={styles.block__features__item__check}
                style={{ borderColor: color }}
              ></div>
              <p>{feature}</p>
            </div>
          ))}
      </div>
      <Link href='/post/worker/create-listing' passHref>
        <a style={{ color: color, backgroundColor: backgroundLight }}>
          Choose {type} Plan
        </a>
      </Link>
    </div>
  )
}

export default PricingBlock
