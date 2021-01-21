import React, { useState, useRef, useEffect } from "react";

import ModalWrapper from "../modal-wrapper";
import ModalContact from "../modal-contact";
import ModalPublicContact from "../modal-public-contact";

import { useAppContext } from "../app";
import { lookUpTagId } from "../../services";

import "./tag-form.css";

function LoaderDots() {
  return (
    <div className='spinner'>
      <div className='bounce1'></div>
      <div className='bounce2'></div>
      <div className='bounce3'></div>
    </div>
  );
}

export default function TagForm() {
  const [state] = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [lookUpResult, setLookUpResult] = useState(null);
  const [tagId, setTagId] = useState("");

  const contactPrivateModal = useRef(null);
  const contactPublicModal = useRef(null);

  const handleTagIdChange = (e) => {
    setTagId(e.target.value);
  };

  useEffect(() => {
    if (lookUpResult) {
      if (lookUpResult.status === "found") {
        contactPublicModal.current.open();
        handleClear();
      }
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    lookUpTagId(tagId.toUpperCase(), state.location).then((res) => setLookUpResult(res));
    setIsLoading(false);
  };

  const handleClear = () => {
    setTagId("");
    setLookUpResult(null);
  };

  console.log(lookUpResult);
  return (
    <>
      <form className='id-form' onSubmit={handleSubmit}>
        <input
          className='id-form__input'
          maxLength='6'
          type='text'
          placeholder='Enter Tag ID'
          value={tagId}
          onChange={handleTagIdChange}
        />

        <button className='id-form__btn id-form__btn--search' type='submit'>
          {isLoading ? <LoaderDots /> : "Search the owner"}
        </button>
      </form>
      {lookUpResult && lookUpResult.status === "found" && <div className=''>FOUND!!</div>}

      {lookUpResult && lookUpResult.status === "private" && (
        <div className='modal-private'>
          <span className='modal-private__title'>This ID is Private</span>
          <button className='close modal-private__сlose' type='button' onClick={handleClear}>
            Close
          </button>
          <span className='modal-private__desc'>But you can always reach the owner through us!</span>
          <button className='modal-private__btn' type='button' onClick={() => contactPrivateModal.current.open()}>
            Contact Owner
          </button>
        </div>
      )}
      {lookUpResult && lookUpResult.status === "disabled" && (
        <div className='modal-disabled'>
          <span className='modal-disabled__title'>This ID is Disabled</span>
          <button className='close modal-disabled__close' type='button' onClick={handleClear}>
            Close
          </button>
          <span className='modal-disabled__desc'>Sorry! We will let the owner know</span>
        </div>
      )}

      <ModalWrapper ref={contactPrivateModal} header={"Contact Owner"}>
        <ModalContact data={lookUpResult} tagId={tagId} />
      </ModalWrapper>
      <ModalWrapper ref={contactPublicModal} header={"Contact Owner"}>
        <ModalPublicContact data={lookUpResult} tagId={tagId} />
      </ModalWrapper>
    </>
  );
}
