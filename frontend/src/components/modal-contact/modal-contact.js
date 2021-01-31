import React, { useState } from "react";
import { useAppContext } from "../app";
import { sendPrivateMessage } from "../../services";

import validateForm from "./validator";

export default function ModalContact({ tagId }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});

  const [state] = useAppContext();


  const handleSubmit = (e) => {
    e.preventDefault();
    const form = {
      name: name,
      phone: phone,
      text: text,
    };
    const validatedForm = validateForm(form);
    if (Object.keys(validatedForm).length === 0 && validatedForm.constructor === Object) {
      const { location } = state;
      sendPrivateMessage(name, phone, text, tagId, location)
        .then((res) => {
          if (res.error) throw Error(res.error);
          if (res.status === "ok") setStatus("You message has been sent!");
          setTimeout(() => window.location.reload(), 2000);
        })
        .catch((e) => alert(e));
    } else {
      setErrors(validatedForm);
    }
  };

  return (
    <>
      <div className='modal__content'>
        <div className='contact-owner__notice'>
          <p>
            Your Information will beprivate and confidential. Spamming of any kind is strictly prohibited and will be reported.
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
          {errors.name && <div className="input-error">{errors.name}</div>}

          <label className='label contact-owner__label'>
            <span>Phone Number</span>
            <input
              className='input contact-owner__input'
              type='tel'
              name='phone'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>
          {errors.phone && <div className="input-error">{errors.phone}</div>}

          <label className='label contact-owner__label'>
            <span>Message</span>
            <textarea
              className='textarea contact-owner__textarea'
              name='text'
              value={text}
              onChange={(e) => setText(e.target.value)}></textarea>
          </label>
          {errors.text && <div className="input-error">{errors.text}</div>}

          {status && <div className='contac-owner__confirmation'>{status}</div>}
        </form>
      </div>

      <div className='modal__footer'>
        <button className='button' type='submit' onClick={handleSubmit}>
          Send Message
        </button>
      </div>
    </>
  );
}
