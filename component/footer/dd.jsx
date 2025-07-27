import React, { useRef } from 'react'
import Modal from './PPandTC'

const Footer = () => {
  const privacyRef = useRef({ onClose: null })
  const termsRef = useRef({ onClose: null })

  const openModal = (ref) => {
    document.body.style.overflow = 'hidden'
    ref.current.open()
  }

  const closeModal = (ref) => {
    document.body.style.overflow = ''
    ref.current.close()
  }

  privacyRef.current.onClose = () => closeModal(privacyRef)
  termsRef.current.onClose = () => closeModal(termsRef)

  return (
    <footer>
      {/* ...other content */}
      <button onClick={() => openModal(privacyRef)}>Privacy Policy</button>
      <button onClick={() => openModal(termsRef)}>Terms & Conditions</button>

      <Modal ref={privacyRef}>
        <h2>Privacy Policy</h2>
        <p>…your policy content…</p>
      </Modal>

      <Modal ref={termsRef}>
        <h2>Terms & Conditions</h2>
        <p>…your terms content…</p>
      </Modal>
    </footer>
  )
}

export default Footer