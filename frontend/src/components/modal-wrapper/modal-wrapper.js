import React, { useState, useEffect, useImperativeHandle, forwardRef, useCallback } from "react";
import { createPortal } from "react-dom";

const modalElement = document.getElementById("modal-root");

export function ModalWrapper({ children, header, defaultOpened = false}, ref) {
  const [isOpen, setIsOpen] = useState(defaultOpened);

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }));

  const handleCloseBtn = () => {
    console.log("Closing modal");
    setIsOpen(false);
  };

  const handleEscape = useCallback((event) => {
    if (event.keyCode === 27) {
      console.log("Esc event detected")
      setIsOpen(false)
    };
  }, []);

  useEffect(() => {
    const windowOffset = window.scrollY;
    if (isOpen) {
      window.addEventListener("keydown", handleEscape, false);
      document.body.setAttribute('style', `position: fixed; top: -${windowOffset}px; left: 0; right: 0;`)
    }
    return () => {
      window.removeEventListener("keydown", handleEscape, false);
      document.body.setAttribute('style', '');
      window.scrollTo(0, windowOffset)
    };
  }, [handleEscape, isOpen]);

  return createPortal(
    isOpen ? (
      <div className='modal'>
        <div className='modal__inner' >
          <div className='modal__header'>
            <span className='title title--modal'>{header}</span>
            <button className='close' onClick={handleCloseBtn}>close</button>
          </div>
          {children}
        </div>
        <div className="modal__overlay"></div>
      </div>
    ) : null,
    modalElement
  );
}

export default forwardRef(ModalWrapper);
