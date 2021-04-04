import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

import ModalWrapper from "../modal-wrapper";
import ModalContact from "../modal-contact";
import ModalPublicContact from "../modal-public-contact";

import { useAppContext } from "../app";
import { lookUpTagId } from "../../services";

import "./tag-form.css";
import tooltip from "../../images/tooltip-img.jpg";

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
  const [tooltipActive, setTooltipActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lookUpResult, setLookUpResult] = useState(null);
  const [tagId, setTagId] = useState("");
  const [captchaValue, setCaptchaValue] = useState("");
  const [searchCount, setSearchCount] = useState(0);

  const { tagIdFromRequest } = useParams();

  const contactPrivateModal = useRef(null);
  const contactPublicModal = useRef(null);

  const _captchaKey = process.env.REACT_APP_CAPTCHA_KEY || "";

  const handleTagIdChange = (e) => {
    setTagId(e.target.value.toUpperCase());
  };

  useEffect(() => {
    if (lookUpResult) {
      if (lookUpResult.status === "found") {
        contactPublicModal.current.open();
      }
    }
  }, [lookUpResult]);

  const triggerLookup = (tagId) => {
    setSearchCount(searchCount + 1);
    if (searchCount > 2 && captchaValue === "") {
      setLookUpResult({ message: "Please confirm you are not a robot", status: "captcha" });
      return;
    }
    if ((tagId.length === 6 && captchaValue) || (tagId.length === 6 && searchCount < 2)) {
      setIsLoading(true);
      lookUpTagId(tagId.toUpperCase(), state.location).then((res) => setLookUpResult(res));
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    triggerLookup(tagId);
  };

  useEffect(() => {
    if (tagIdFromRequest && state.location) {
      if ((tagIdFromRequest.length === 6 && captchaValue) || (tagIdFromRequest.length === 6 && searchCount < 2)) {
        console.log(`This page has loaded with following request tagId: ${tagIdFromRequest}`);
        console.log("And this is location:", state.location);
        setIsLoading(true);
        lookUpTagId(tagIdFromRequest.toUpperCase(), state.location).then((res) => {
          if (res.status === "private") {
            setTagId(tagIdFromRequest);
            contactPrivateModal.current.open();
          }
          if (res.status === "found") setLookUpResult(res);
          if (res.status === "na") setLookUpResult(res);
        });
        setIsLoading(false);
      }
    }
  }, [tagIdFromRequest, state.location]);

  const handleClear = () => {
    setTagId("");
    setLookUpResult(null);
  };

  const handleMouseLeave = () => {
    setTooltipActive(false);
  };

  const handleFocus = (e) => {
    e.target.focus();
    setTooltipActive(true);
  };

  const handleCaptcha = (value) => {
    setCaptchaValue(value);
    setSearchCount(0);
  };

  return (
    <>
      {searchCount > 2 && tagId.length >= 3 && (
        <div className='captcha'>
          <ReCAPTCHA sitekey={_captchaKey} onChange={handleCaptcha} />
        </div>
      )}
      <form className='id-form' onSubmit={handleSubmit}>
        <div className='id-form__box'>
          <input
            className='id-form__input'
            maxLength='6'
            type='text'
            placeholder='Enter Tag ID'
            value={tagId}
            onChange={handleTagIdChange}
          />
        </div>

        <div className='tooltip-tag'>
          <button
            type='button'
            className='tooltip-tag__icon'
            onClick={(e) => handleFocus(e)}
            onBlur={handleMouseLeave}></button>
          {tooltipActive && (
            <div className='tooltip-tag__id'>
              <div className='tooltip-tag__text'>
                The <span>six digit number on the back of the tag</span> is your items unique code that is used to find
                it if it ever go missing
              </div>

              <div className='tooltip-tag__img'>
                <img src={tooltip} alt='' />
              </div>

              <span className='tooltip-tag__link'>Example of a 6 digit Tag-ID</span>
            </div>
          )}
        </div>

        <button className='id-form__btn id-form__btn--search' type='submit'>
          {isLoading ? <LoaderDots /> : "Search the owner"}
        </button>
      </form>

      <div className='modal__wrapper'>
        {lookUpResult && lookUpResult.status === "captcha" && (
          <div className='modal-disabled'>
            <span className='modal-disabled__title'>Pleae confirm you are not a robot</span>
            <button className='close modal-disabled__close' type='button' onClick={handleClear}>
              Close
            </button>
            <span className='modal-disabled__desc'>Click on the icon above and try again!</span>
          </div>
        )}

        {lookUpResult && lookUpResult.status === "na" && (
          <div className='modal-disabled'>
            <span className='modal-disabled__title'>No such Tag ID</span>
            <button className='close modal-disabled__close' type='button' onClick={handleClear}>
              Close
            </button>
            <span className='modal-disabled__desc'>Check your input and try again!</span>
          </div>
        )}

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
      </div>

      <ModalWrapper ref={contactPrivateModal} header={"Contact Owner"}>
        <ModalContact tagId={tagId} />
      </ModalWrapper>

      <ModalWrapper ref={contactPublicModal} header={"Contact Owner"}>
        <ModalPublicContact lookUpData={lookUpResult} />
      </ModalWrapper>
    </>
  );
}
