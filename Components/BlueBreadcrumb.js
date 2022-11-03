import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import styles from '../styles/WorkerBreadcrumbs.module.scss'

function BlueBreadcrumb({
  path,
  ahref,
  currentPath,
  text,
  position,
  borderClass,
  red,
}) {
  const [color, setColor] = useState('#fff')

  useEffect(() => {
    red ? setColor('#C9A596') : setColor('#96a4c9')
  }, [color])

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
                backgroundColor: currentPath == path ? color : '#fff',
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
          style={{ backgroundColor: currentPath == path ? color : '#fff' }}
        >
          {text}
        </li>
      )}
    </>
  )
}

export default BlueBreadcrumb
