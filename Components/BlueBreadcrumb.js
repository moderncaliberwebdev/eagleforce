import Link from 'next/link'
import React from 'react'

import styles from '../styles/WorkerBreadcrumbs.module.scss'

function BlueBreadcrumb({ path, currentPath, text, position, borderClass }) {
  return (
    // <Link href={path} passHref>
    //   <a>
    <li
      className={
        borderClass == 'first'
          ? styles.first_a
          : borderClass == 'last'
          ? styles.last_a
          : styles.list_a
      }
      style={{ backgroundColor: currentPath == path ? '#96a4c9' : '#fff' }}
    >
      {text}
    </li>
    //   </a>
    // </Link>
  )
}

export default BlueBreadcrumb
