import React, { useState, useReducer } from "react";
import ReCAPTCHA from "react-google-recaptcha";

import validateForm from "./validator";
import { sendContactMessage } from "../../services";

import "./contact-us.css";

const _captchaKey = process.env.REACT_APP_CAPTCHA_KEY || "";
const initialFormState = {
  name: "",
  email: "",
  message: "",
};

function reducer(state, { field, value }) {
  return {
    ...state,
    [field]: value,
  };
}

function ContactUs() {
  const [state, dispatch] = useReducer(reducer, initialFormState);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");

  const { name, email, message, recaptcha } = state;

  const handleCaptcha = (value) => {
    dispatch({
      field: "recaptcha",
      value: value,
    });
  };

  const onChange = (e) => {
    dispatch({
      field: e.target.name,
      value: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validatedForm = validateForm(state);
    if (Object.keys(validatedForm).length === 0 && validatedForm.constructor === Object && recaptcha) {
      sendContactMessage(name, email, message)
        .then((res) => {
          if (res.error) throw Error(res.error);
          if (res.status === "ok") {
            setStatus("You message has been sent!");
            setErrors({});
          }
        })
        .catch((e) => alert(e));
    } else {
      setErrors(validatedForm);
    }
  };

  return (
    <>
      <div className='container'>
        <div className='contact-us'>
          <span className='title register-item__title'>Contact Us</span>
          <form className='create-account__form' onSubmit={handleSubmit} autoComplete='off'>
            <label className='label'>
              <span>Name</span>
              <input
                required='required'
                className='input input contact-owner__input'
                type='text'
                name='name'
                value={name}
                onChange={onChange}
              />
              {errors.name && <div className='input-error'>{errors.name}</div>}
            </label>
            <label className='label'>
              <span>Email</span>
              <input
                required='required'
                className='input input contact-owner__input'
                type='email'
                name='email'
                value={email}
                onChange={onChange}
              />
              {errors.email && <div className='input-error'>{errors.email}</div>}
            </label>
            <label className='label contact-owner__label'>
              <span>Message</span>
              <textarea
                className='textarea contact-owner__textarea'
                name='message'
                value={message}
                onChange={onChange}></textarea>
            </label>
            {errors.message && <div className='input-error'>{errors.message}</div>}
            <div className='contact-us__recaptcha'>
              <ReCAPTCHA sitekey={_captchaKey} onChange={handleCaptcha} />
            </div>
            {errors.recaptcha && <div className='input-error'>{errors.recaptcha}</div>}

            <button className='button' type='submit'>
              Send Message
            </button>

            {status && <div className='contac-owner__confirmation'>{status}</div>}
          </form>
        </div>
      </div>
    </>
  );
}

export default ContactUs;
