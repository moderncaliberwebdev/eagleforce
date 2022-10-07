import dynamic from 'next/dynamic'
import React from 'react'
import 'react-quill/dist/quill.snow.css'
const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
})

function RichText() {
  return <QuillNoSSRWrapper theme='snow' />
}

export default RichText
