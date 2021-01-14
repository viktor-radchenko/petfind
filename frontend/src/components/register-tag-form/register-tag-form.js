import React, { useEffect, useReducer } from "react";
import { Link } from "react-router-dom";

import { completeRegistration } from "../../services";

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
  console.log(state);

  const {
    tagIdMessage,
    tagIdIsValid,
    currentStep,
    tagId,
    tagName,
    tagImage,
    firstName,
    lastName,
    phone,
    email,
    address,
    city,
    country,
    zipCode,
    userState,
  } = state;

  const onChange = (e) => {
    dispatch({
      field: e.target.name,
      value: e.target.value,
    });
  };

  const onFileChange = (e) => {
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
        if (res === "Confirmed") {
          console.log(`${res} is confirmed`);
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
    console.log(currentStep);
    if (currentStep === 1) {
      dispatch({
        field: "currentStep",
        value: 2,
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    completeRegistration(
      tagId,
      tagName,
      tagImage,
      firstName,
      lastName,
      phone,
      email,
      address,
      city,
      country,
      zipCode,
      userState
    )
      .then((res) => res.json())
      .then((res) => console.log(res))
      .catch((e) => console.error(e));
    // console.log(`Submitted data:`, {
    //   currentStep: currentStep,
    //   tagId: tagId,
    //   tagName: tagName,
    //   tagImage: tagImage,
    //   firstName: firstName,
    //   lastName: lastName,
    //   phone: phone,
    //   email: email,
    //   address: address,
    //   city: city,
    //   country: country,
    //   zipCode: zipCode,
    //   userState: userState,
    // });
  };

  return (
    <>
      <div className='full-logo'>
        <img src='images/logo.png' alt='full logo' />
      </div>

      <ul className='breadcrumbs'>
        <li className='breadcrumbs__item breadcrumbs__item--active'>Register item</li>
        <li className='breadcrumbs__item'>Create Account</li>
      </ul>

      {currentStep === 1 && (
        <section className='register-item'>
          <span className='steps'>step {currentStep} / 2</span>

          <span className='title register-item__title'>Register Item</span>
          <span className='register-item__subtitle'>Add basic details about the item</span>

          <form className='register-item__form' action='#' autoComplete='off'>
            <div className='register-item__box'>
              <div className='register-item__img'>
                <span>Add an Image</span>
                <img src='images/icons/add-photo.svg' alt='img' />
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
              {tagIdMessage && <span className='register-item__message'>{tagIdMessage}</span>}
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
              </label>

              <label className='label'>
                <span>Phone Number</span>
                <input
                  required='required'
                  className='input create-account__input'
                  type='tel'
                  name='phone'
                  value={phone}
                  onChange={onChange}
                />
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

      <div className='go-home'>
        <Link className='go-home__link' to='/'>
          Cancel and back to home
        </Link>
      </div>
    </>
  );
}
