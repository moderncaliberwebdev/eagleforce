import React from 'react'

export const UiFileInputButton = (props) => {
  const fileInputRef = null
  const formRef = null

  const onClickHandler = () => {
    fileInputRef.current.click()
  }

  const onChangeHandler = (event) => {
    if (!event.target.files.length) {
      return
    }

    const formData = new FormData()

    Array.from(event.target.files).forEach((file) => {
      formData.append(event.target.name, file)
    })

    props.onChange(formData)

    formRef.current.reset()
  }

  return (
    <form ref={formRef} className={styles.imagebutton}>
      <button type='button' onClick={onClickHandler}>
        {props.label}
      </button>
      <input
        accept={props.acceptedFileTypes}
        multiple={props.allowMultipleFiles}
        name={props.uploadFileName}
        onChange={onChangeHandler}
        ref={fileInputRef}
        style={{ display: 'none' }}
        type='file'
      />
    </form>
  )
}

UiFileInputButton.defaultProps = {
  acceptedFileTypes: 'image/png, image/jpeg',
  allowMultipleFiles: false,
}
