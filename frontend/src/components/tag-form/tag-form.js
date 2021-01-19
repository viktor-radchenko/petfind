import React, { useState } from "react";

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

  const handleTagIdChange = (e) => {
    setTagId(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    lookUpTagId(tagId.toUpperCase(), state.location).then((res) => setLookUpResult(res));
    setIsLoading(false);
  };

  return (
    <>
      <form className='id-form' onSubmit={handleSubmit}>
        <input
          className='id-form__input'
          maxLength="6"
          type='text'
          placeholder='Enter Tag ID'
          value={tagId}
          onChange={handleTagIdChange}
        />

        <button className='id-form__btn id-form__btn--search' type='submit'>
          {isLoading ? <LoaderDots /> : "Search the owner"}
        </button>
      </form>

      {lookUpResult && <div className=''>{lookUpResult.status}</div>}
    </>
  );
}
