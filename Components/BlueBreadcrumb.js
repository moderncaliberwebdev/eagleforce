import Link from 'next/link'
import React from 'react'

import styles from '../styles/WorkerBreadcrumbs.module.scss'

function BlueBreadcrumb({ path, currentPath, text, position }) {
  return (
    <li className={styles.li}>
      <Link href={path} passHref>
        <a
          style={{ backgroundColor: currentPath == path ? '#96a4c9' : '#fff' }}
          className={
            position == 0
              ? styles.first_a
              : position == 4
              ? styles.last_a
              : styles.list_a
          }
        >
          {text}
        </a>
      </Link>
    </li>
  )
}

export default BlueBreadcrumb
