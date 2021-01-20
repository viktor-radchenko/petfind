import React, { useReducer, useEffect, useState } from "react";
import { authFetch, addRegisteredTag } from "../../services";

import imagePlaceholder from "../../images/icons/add-photo.svg";

const initialFormState = {
  tagId: "",
  tagName: "",
  tagIdMessage: "",
  tagIdIsValid: false,
  tagImage: null,
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

export default function ModalAddTag({ handleNewTag }) {
  const [state, dispatch] = useReducer(reducer, initialFormState);

  const {
    tagId,
    tagIdIsValid,
    tagIdMessage,
    tagName,
    tagImage,
    phone,
    email,
    address,
    city,
    country,
    zipCode,
    userState,
  } = state;
  console.log("Moda state:", state);

  useEffect(() => {
    authFetch("/api/auth/get_user_data")
      .then((response) => {
        if (response.status === 401) {
          console.error("Sorry you aren't authorized!");
          return null;
        }
        return response.json();
      })
      .then((response) => {
        const new_state = {
          phone: response.phone,
          email: response.email,
          address: response.address,
          city: response.city,
          country: response.country,
          zipCode: response.zip_code,
          userState: response.state,
        };

        for (const property in new_state) {
          dispatch({
            field: property,
            value: new_state[property],
          });
        }
      });
  }, []);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Submitting FORM:", state);

    addRegisteredTag(state)
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          console.log("Error detected")
          throw Error(res.error);
        }
        window.location.reload();
      })
      .catch((e) => alert(e));
    // updateRegisteredTag(tagId, state);

    // send data to server
    // receive confirmation from server
    // close modal
  };

  return (
    <>
      <div className='edit-tag__switch'>Item Details</div>
      <form onSubmit={handleSubmit} autoComplete='off'>
        <div className='modal__content'>
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

          <div className='edit-tag__tag'>
            <div className='table__item-tag table__item-tag--title edit-tag__title'>Tag ID</div>

            <label className='label edit-tag__label'>
              <input
                className={
                  tagIdIsValid
                    ? "input register-item__input-id register-item__input-id--active"
                    : "input register-item__input-id"
                }
                type='text'
                name='tagId'
                value={tagId}
                onChange={onChange}
              />
              {tagIdMessage && <span className='register-item__message'>{tagIdMessage}</span>}
            </label>
          </div>

          <label className='label edit-tag__label'>
            <span>Name</span>
            <input
              className='input edit-tag__input edit-tag__input--name'
              type='text'
              name='tagName'
              value={tagName}
              onChange={onChange}
            />
          </label>
        </div>

        <div className='edit-tag__switch edit-tag__switch--active'>Address Details</div>

        <div className='modal__content'>
          <div className='edit-tag__location'>
            <label className='label edit-tag__label--input'>
              <span>Address</span>
              <input
                className='input edit-tag__input edit-tag__input--address'
                type='text'
                name='address'
                value={address}
                onChange={onChange}
              />
            </label>

            <label className='label edit-tag__label--input'>
              <span>City</span>
              <input className='select edit-tag__input' type='text' name='city' value={city} onChange={onChange} />
            </label>

            <label className='label edit-tag__label--input'>
              <span>State</span>
              <input
                className='select edit-tag__input'
                type='text'
                name='userState'
                value={userState}
                onChange={onChange}
              />
            </label>

            <label className='label edit-tag__label--input'>
              <span>Country</span>
              <input
                className='select edit-tag__input'
                type='text'
                name='country'
                value={country}
                onChange={onChange}
              />
            </label>

            <label className='label edit-tag__label--input'>
              <span>ZIP code</span>
              <input
                className='select edit-tag__input'
                type='text'
                name='zipCode'
                value={zipCode}
                onChange={onChange}
              />
            </label>

            <label className='label edit-tag__label--input'>
              <span>Phone Number</span>
              <input className='input edit-tag__input' type='tel' name='phone' value={phone} onChange={onChange} />
            </label>

            <label className='label edit-tag__label--input'>
              <span>Email Address</span>
              <input className='input edit-tag__input' type='email' name='email' value={email} onChange={onChange} />
            </label>
          </div>
        </div>

        <div className='modal__footer'>
          <button disabled={!tagIdIsValid} className='button' type='submit'>
            Update
          </button>
        </div>
      </form>
    </>
  );
}
