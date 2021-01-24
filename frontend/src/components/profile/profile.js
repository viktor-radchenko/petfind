import React, { useState, useEffect, useReducer } from "react";
import { Link, useHistory } from "react-router-dom";
import { logout, updateProfile } from "../../services";

import validateForm from "./validator";

const initialFormState = {
  firstName: "",
  lastName: "",
  phone: "",
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

export default function Profile({ userData }) {
  const [state, dispatch] = useReducer(reducer, initialFormState);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const history = useHistory();

  console.log(state);

  const { firstName, lastName, phone, address, city, country, zipCode, userState } = state;

  const handlePasswordReset = () => {
    logout();
    history.push('/auth/forgot_password');
  }

  const updateInitialState = (data) => {
    console.log("Updating initial state", data);
    return {
      phone: data.phone,
      address: data.address,
      city: data.city,
      country: data.country,
      zipCode: data.zipCode,
      userState: data.userState,
      firstName: data.firstName,
      lastName: data.lastName,
    };
  };

  useEffect(() => {
    const new_data = updateInitialState(userData);
    for (const property in new_data) {
      dispatch({
        field: property,
        value: new_data[property],
      });
    }
  }, []);

  const onChange = (e) => {
    dispatch({
      field: e.target.name,
      value: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validatedForm = validateForm(state);
    if (Object.keys(validatedForm).length === 0 && validatedForm.constructor === Object) {
      updateProfile(state)
        .then((res) => {
          if (!res.ok) throw new Error("ehm");
          return res.json();
        })
        .then((res) => {
          console.log(res);
          if (res.message) window.location.reload();
          if (res.error) setServerError(res.error);
        })
        .catch((e) => alert(e.message));
    } else {
      setErrors(validatedForm);
    }
  };

  return (
    <>
      <form className='profile__form' onSubmit={handleSubmit}>
        <div className='profile__form-group'>
          <label className='label'>
            <span>First Name</span>
            <input
              required='required'
              className='input edit-tag__input'
              type='text'
              name='firstName'
              value={firstName}
              onChange={onChange}
            />
            {errors.firstName && <div className='input-error input-error--main'>{errors.firstName}</div>}
          </label>

          <label className='label'>
            <span>Last Name</span>
            <input
              required='required'
              className='input edit-tag__input'
              type='text'
              name='lastName'
              value={lastName}
              onChange={onChange}
            />
            {errors.lastName && <div className='input-error input-error--main'>{errors.lastName}</div>}
          </label>

          <label className='label'>
            <span>Phone Number</span>
            <input
              required='required'
              className='input edit-tag__input'
              type='tel'
              name='phone'
              value={phone}
              onChange={onChange}
            />
            {errors.phone && <div className='input-error input-error--main'>{errors.phone}</div>}
          </label>

          <label className='label edit-tag__label'>
            <span>Address</span>
            <input
              className='input edit-tag__input edit-tag__input--address'
              type='text'
              name='address'
              value={address}
              onChange={onChange}
            />
          </label>
        </div>

        <div className='profile__form-group'>
          <label className='label'>
            <span>City</span>
            <input className='input edit-tag__input' type='text' name='city' value={city} onChange={onChange} />
          </label>

          <label className='label'>
            <span>State</span>
            <input
              className='input edit-tag__input'
              type='text'
              name='userState'
              value={userState}
              onChange={onChange}
            />
          </label>

          <label className='label'>
            <span>Country</span>
            <input className='input edit-tag__input' type='text' name='country' value={country} onChange={onChange} />
          </label>

          <label className='label'>
            <span>ZIP code</span>
            <input className='input edit-tag__input' type='text' name='zipCode' value={zipCode} onChange={onChange} />
          </label>
        </div>

        <button className='button profile__form-submit' type='submit'>
          Update
        </button>
      </form>

      <div className='profile__reset-password'>
        <span className="label">Password:</span>
        <button className='button profile__reset-password-btn' type='button' onClick={handlePasswordReset}>
          Update password
        </button>
      </div>
    </>
  );
}
