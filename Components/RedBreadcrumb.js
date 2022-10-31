import Link from 'next/link'
import React from 'react'

import styles from '../styles/WorkerBreadcrumbs.module.scss'

function BlueBreadcrumb({
  path,
  ahref,
  currentPath,
  text,
  position,
  borderClass,
}) {
  return (
    <>
      {ahref ? (
        <Link href={ahref} passHref>
          <a>
            <li
              className={
                borderClass == 'first'
                  ? styles.first_a
                  : borderClass == 'last'
                  ? styles.last_a
                  : styles.list_a
              }
              style={{
                backgroundColor: currentPath == path ? '#C9A596' : '#fff',
              }}
            >
              {text}
            </li>
          </a>
        </Link>
      ) : (
        <li
          className={
            borderClass == 'first'
              ? styles.first_a
              : borderClass == 'last'
              ? styles.last_a
              : styles.list_a
          }
          style={{ backgroundColor: currentPath == path ? '#C9A596' : '#fff' }}
        >
          {text}
        </li>
      )}
    </>
  )
}

export default BlueBreadcrumb
