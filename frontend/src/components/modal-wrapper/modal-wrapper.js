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
    setIsOpen(false);
  };

  const handleEscape = useCallback((event) => {
    console.log("some key event detected", event)
    if (event.keyCode === 27) {
      console.log("Esc event detected")
      setIsOpen(false)
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      console.log("Esc event listener added")
      window.addEventListener("keydown", handleEscape, false);
    }
    return () => {
      window.removeEventListener("keydown", handleEscape, false);
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
      </div>
    ) : null,
    modalElement
  );
}

export default forwardRef(ModalWrapper);
