import React, { useEffect, useReducer, useState } from "react";
import { Link } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import { useAppContext } from "../app";

import { completeRegistration } from "../../services";
import { validateTagForm, validateUserForm } from "./validator";

import logo from "../../images/logo.png";
import imagePlaceholder from "../../images/icons/add-photo.svg";
import "./register-tag-form.css";

const initialFormState = {
  tagIdMessage: "",
  tagIdIsValid: false,
  currentStep: 1,
  tagId: "",
  tagName: "",
  tagImage: null,
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  country: "",
  zipCode: "",
  userState: "",
};

function reducer(state, { field, value }) {
  return {
    ...state,
    [field]: value,
  };
}

export default function RegisterTagForm() {
  // Initialise registration form state
  const [state, dispatch] = useReducer(reducer, initialFormState);
  const [errors, setErrors] = useState({});
  const [appState] = useAppContext();
  const [serverError, setServerError] = useState("");
  const [phoneValue, setPhoneValue] = useState("");

  const {
    tagIdMessage,
    tagIdIsValid,
    currentStep,
    tagId,
    tagName,
    tagImage,
    firstName,
    lastName,
    email,
    address,
    city,
    country,
    zipCode,
    userState,
  } = state;

  useEffect(() => {
    if (appState.registerTagId)
      dispatch({
        field: "tagId",
        value: appState.registerTagId,
      });
  }, []);

  const onChange = (e) => {
    dispatch({
      field: e.target.name,
      value: e.target.value,
    });
  };

  const onFileChange = (e) => {
    console.log(e.target.files[0]);
    dispatch({
      field: e.target.name,
      value: e.target.files[0],
    });
  };

  // Validate tagId
  useEffect(() => {
    if (tagId.length === 6) {
      const fetchTagId = async () => {
        return await fetch(`/api/tag-id-lookup/${tagId.toUpperCase()}`)
          .then((res) => res.json())
          .then((res) => res.message);
      };
      fetchTagId().then((res) => {
        dispatch({
          field: "tagIdMessage",
          value: res,
        });
        if (res === "Available") {
          dispatch({
            field: "tagIdIsValid",
            value: true,
          });
        }
      });
    } else {
      dispatch({ field: "tagIdIsValid", value: false });
      dispatch({ field: "tagIdMessage", value: "" });
    }
  }, [tagId]);

  const handleNextStep = () => {
    // submit first form and switch to the next
    const values = {
      tagId: tagId,
      tagName: tagName,
      tagImage: tagImage,
    };
    const validatedForm = validateTagForm(values);
    if (Object.keys(validatedForm).length === 0 && validatedForm.constructor === Object) {
      if (currentStep === 1) {
        dispatch({
          field: "currentStep",
          value: 2,
        });
      }
    } else {
      setErrors(validatedForm);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const values = {
      firstName: firstName,
      lastName: lastName,
      phone: phoneValue,
      email: email,
    };
    const validatedForm = validateUserForm(values);
    if (Object.keys(validatedForm).length === 0 && validatedForm.constructor === Object) {
      completeRegistration(
        tagId,
        tagName,
        tagImage,
        firstName,
        lastName,
        phoneValue,
        email,
        address,
        city,
        country,
        zipCode,
        userState
      )
        .then((res) => {
          if (!res.ok) throw new Error("Internal server error. Please try again or contact support for help");
          return res.json();
        })
        .then((res) => {
          if (res.error) setServerError(res.error);
          if (res.confirmed) {
            localStorage.setItem("confirmation_pending", email);
            dispatch({
              field: "currentStep",
              value: 3,
            });
          }
        })
        .catch((e) => alert(e));
    } else {
      setErrors(validatedForm);
    }
  };

  return (
    <>
      <Link className='full-logo' to='/'>
        <img src={logo} alt='full logo' />
      </Link>

      {currentStep !== 3 ? (
        <ul className='breadcrumbs'>
          <li
            className={`breadcrumbs__item ${currentStep === 2 ? "breadcrumbs__item--active" : null}`}
            onClick={() =>
              dispatch({
                field: "currentStep",
                value: 1,
              })
            }>
            Register item
          </li>
          <li className='breadcrumbs__item'>Create Account</li>
        </ul>
      ) : null}

      {currentStep === 1 && (
        <section className='register-item'>
          <span className='steps'>step {currentStep} / 2</span>

          <span className='title register-item__title'>Register Item</span>
          <span className='register-item__subtitle'>Add basic details about the item</span>

          <form className='register-item__form' action='#' autoComplete='off'>
            <div className='register-item__box'>
              <div className='register-item__img'>
                <span>Add an Image</span>
                <img src={tagImage ? URL.createObjectURL(tagImage) : imagePlaceholder} alt='img' />
              </div>

              <label className='register-item__label'>
                <input
                  className='register-item__file'
                  type='file'
                  accept='image/*'
                  name='tagImage'
                  onChange={onFileChange}
                />
                <span className='register-item__upload'>Upload image</span>
                <span className='register-item__max'>max file size 2mb</span>
              </label>
            </div>
            {errors.tagImage && <div className='input-error'>{errors.tagImage}</div>}


            <label className='label label__tag-id'>
              <span>Tag ID</span>
              <input
                className={
                  tagIdIsValid
                    ? "input register-item__input-id register-item__input-id--active"
                    : "input register-item__input-id"
                }
                type='text'
                maxLength='6'
                name='tagId'
                value={tagId}
                onChange={onChange}
              />
              {tagIdMessage && (
                <div
                  className={`input-error input-error--main ${
                    tagIdMessage.includes("Available") ? "register-item__message" : null
                  }`}>
                  {tagIdMessage}
                </div>
              )}
              {errors.tagId && <div className='input-error input-error--main'>{errors.tagId}</div>}
            </label>

            <label className='label'>
              <span>Item Name</span>
              <input
                className='input register-item__input'
                type='text'
                name='tagName'
                value={tagName}
                onChange={onChange}
              />
              {errors.tagName && <div className='input-error'>{errors.tagName}</div>}
            </label>

            <button
              disabled={!tagIdIsValid}
              className='button register-item__btn'
              type='button'
              onClick={handleNextStep}>
              Next
            </button>
          </form>
        </section>
      )}

      {currentStep === 2 && (
        <section className='create-account'>
          <span className='steps'> step {currentStep} / 2 </span>

          <span className='title'> Create Account </span>

          <span className='register-item__subtitle'> Add personal details about you </span>

          <form className='create-account__form' action='#' autoComplete='off'>
            <div className='create-account__name'>
              <label className='label'>
                <span>First Name</span>
                <input
                  required='required'
                  className='input create-account__input'
                  type='text'
                  name='firstName'
                  value={firstName}
                  onChange={onChange}
                />
                {errors.firstName && <div className='input-error'>{errors.firstName}</div>}
              </label>

              <label className='label'>
                <span>Last Name</span>
                <input
                  required='required'
                  className='input create-account__input'
                  type='text'
                  name='lastName'
                  value={lastName}
                  onChange={onChange}
                />
                {errors.lastName && <div className='input-error'>{errors.lastName}</div>}
              </label>

              <label className='label'>
                <span>Phone Number</span>
                <PhoneInput
                  required='required'
                  className='input create-account__input'
                  type='tel'
                  name='phone'
                  placeholder='(123) 456 78 90 '
                  defaultCountry='US'
                  value={phoneValue}
                  onChange={setPhoneValue}
                />
                {errors.phone && <div className='input-error'>{errors.phone}</div>}
              </label>

              <label className='label'>
                <span>Email Address</span>
                <input
                  required='required'
                  className='input create-account__input'
                  type='email'
                  name='email'
                  value={email}
                  onChange={onChange}
                />
                {errors.email && <div className='input-error'>{errors.email}</div>}
              </label>
            </div>

            <div className='create-account__location'>
              <label className='label'>
                <span>Address</span>
                <input
                  className='input create-account__input--address'
                  type='text'
                  name='address'
                  value={address}
                  onChange={onChange}
                />
              </label>

              <label className='label'>
                <span>City</span>
                <input
                  className='input create-account__input'
                  type='text'
                  name='city'
                  value={city}
                  onChange={onChange}
                />
                {/* TODO: Connect Address API to select inputs */}
                {/* <select className='select' name='city' value={city} onChange={onChange}></select> */}
              </label>

              <label className='label'>
                <span>State</span>
                <input
                  className='input create-account__input'
                  type='text'
                  name='userState'
                  value={userState}
                  onChange={onChange}
                />
                {/* <select className='select' name='userState' value={userState} onChange={onChange}></select> */}
              </label>

              <label className='label'>
                <span>Country</span>
                <input
                  className='input create-account__input'
                  type='text'
                  name='country'
                  value={country}
                  onChange={onChange}
                />
                {/* <select className='select' name='country' value={country} onChange={onChange}>
                  <option value='United States'>United States</option>
                </select> */}
              </label>

              <label className='label'>
                <span>ZIP code</span>
                <input
                  className='input create-account__input'
                  type='text'
                  name='zipCode'
                  value={zipCode}
                  onChange={onChange}
                />
              </label>
            </div>

            {serverError && <div className='input-error input-error--main'>{serverError}</div>}

            <div className='create-account__bottom'>
              <button className='button create-account__btn' type='submit' onClick={handleSubmit}>
                Signup & Register
              </button>

              <span className='create-account__login'>
                Already have an account? <Link to='/login'>Login</Link>
              </span>
            </div>
          </form>
        </section>
      )}

      {currentStep === 3 && (
        <section className='password-notify'>
          <span className='title password-notify__title'>Set your password</span>

          <p className='password-notify__text'>You need to set a password. We have sent you a link at {email}.</p>

          <button className='password-notify__link'>Resend Link</button>
        </section>
      )}

      <div className='go-home'>
        <Link className='go-home__link' to='/'>
          Cancel and back to home
        </Link>
      </div>
    </>
  );
}
