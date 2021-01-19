import React from "react";

export default function ModalWrapper(props) {
  return (
    <div className='modal'>
      <div className='modal__inner'>{props.children}</div>
    </div>
  );
}
