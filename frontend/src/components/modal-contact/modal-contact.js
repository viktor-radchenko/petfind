import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import { useAppContext } from "../app";
import { sendPrivateMessage } from "../../services";

import validateForm from "./validator";

export default function ModalContact({ tagId }) {
  const [name, setName] = useState("");
  const [phoneValue, setPhoneValue] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});

  const history = useHistory();

  const [state] = useAppContext();

  console.log("Passed to modal ID:", tagId);

  const clearState = () => {
    setText("");
    setPhoneValue("");
    setName("");
    setStatus("You message has been sent!");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = {
      name: name,
      phone: phoneValue,
      text: text,
    };
    const validatedForm = validateForm(form);
    if (Object.keys(validatedForm).length === 0 && validatedForm.constructor === Object) {
      const { location } = state;
      sendPrivateMessage(name, phoneValue, text, tagId, location)
        .then((res) => {
          if (res.error) throw Error(res.error);
          if (res.status === "ok") clearState();
          history.push("/");
          setTimeout(() => window.location.reload(), 1000);
        })
        .catch((e) => alert(e));
    } else {
      setErrors(validatedForm);
    }
  };

  return (
    <>
      <div className='modal__content'>
        {status ? (
          <div className='contac-owner__confirmation'>{status}</div>
        ) : (
          <>
            <div className='contact-owner__notice'>
              <p>
                Your Information will beprivate and confidential. Spamming of any kind is strictly prohibited and will
                be reported.
              </p>
            </div>

            <form className='contact-owner__form' onSubmit={handleSubmit}>
              <label className='label contact-owner__label'>
                <span>Name</span>
                <input
                  className='input contact-owner__input'
                  type='text'
                  name='name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              {errors.name && <div className='input-error'>{errors.name}</div>}

              <label className='label contact-owner__label'>
                <span>Phone Number</span>

                <PhoneInput
                  required='required'
                  className='input contact-owner__input'
                  type='tel'
                  name='phone'
                  placeholder='(123) 456 78 90 '
                  defaultCountry='US'
                  value={phoneValue}
                  onChange={setPhoneValue}
                />
              </label>
              {errors.phone && <div className='input-error'>{errors.phone}</div>}

              <label className='label contact-owner__label'>
                <span>Message</span>
                <textarea
                  className='textarea contact-owner__textarea'
                  name='text'
                  value={text}
                  onChange={(e) => setText(e.target.value)}></textarea>
              </label>
              {errors.text && <div className='input-error'>{errors.text}</div>}
            </form>
          </>
        )}
      </div>
      {!status && (
        <div className='modal__footer'>
          <button className='button' type='submit' onClick={handleSubmit}>
            Send Message
          </button>
        </div>
      )}
    </>
  );
}
