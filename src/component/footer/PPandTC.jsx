import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import './ppandtc.css'

const Modal = forwardRef(({ children }, ref) => {
  const modalRef = useRef()
  const overlayRef = useRef()
  
  const close = () => {
    if (ref.current && ref.current.onClose) {
      ref.current.onClose()
    }
  }

  useImperativeHandle(ref, () => ({
    open: () => modalRef.current.classList.add('open'),
    close
  }))

  useEffect(() => {
    const escHandler = e => e.key === 'Escape' && close()
    document.addEventListener('keydown', escHandler)
    return () => document.removeEventListener('keydown', escHandler)
  })

  return createPortal(
    <div ref={modalRef} className="modal-overlay">
      <div className="modal-window">
        <button className="modal-close" onClick={close}>×</button>
        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.getElementById('modal-root')
  )
})

export default Modal