import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import 'react-quill/dist/quill.snow.css'
const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
})

function RichText({
  updateListingInfo,
  updateJobInfo,
  textHTML,
  updateEmployerListingInfo,
  richText,
}) {
  const [value, setValue] = useState('')

  useEffect(() => {
    textHTML && setValue(textHTML)
  }, [textHTML])

  if (updateListingInfo) {
    useEffect(() => {
      value.length > 0 && updateListingInfo(9, value)
    }, [value])
  } else if (updateJobInfo) {
    useEffect(() => {
      value.length > 0 && updateJobInfo(3, value)
    }, [value])
  } else if (updateEmployerListingInfo) {
    useEffect(() => {
      value.length > 0 && updateEmployerListingInfo(richText, value)
    }, [value])
  }

  return <QuillNoSSRWrapper theme='snow' value={value} onChange={setValue} />
}

export default RichText
