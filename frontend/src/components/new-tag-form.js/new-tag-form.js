import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { useAppContext } from "../app";

import tooltip from '../../images/tooltip-img.jpg';

export default function NewTagForm() {
  const [tagId, setTagId] = useState("");
  const [tooltipActive, setTooltipActive] = useState(false);
  // eslint-disable-next-line
  const [state, dispatch] = useAppContext();
  const history = useHistory();

  const customRedirect = () => {
    dispatch({
      type: "REGISTER_TAG_ID",
      payload: tagId,
    });
    history.push('/register_tag')
  }

  const handleMouseLeave = () => {
    setTooltipActive(false);
  }

  return (
    <>
      <form className='header__id-form id-form' onSubmit={customRedirect}>
        <div className='id-form__box'>
          <input
            className='id-form__input'
            type='text'
            maxLength='6'
            placeholder='Enter Tag ID'
            value={tagId}
            onChange={(e) => setTagId(e.target.value.toUpperCase())}
          />

          <div className='tooltip-tag'>
            <button className="tooltip-tag__icon" type="button" onFocus={() => setTooltipActive(true)} onBlur={handleMouseLeave}></button>
            {tooltipActive && <div className='tooltip-tag__id'>
              <div className='tooltip-tag__text'>
                The <span>six digit number on the back of the tag</span> is your items unique code that is used to find
                it if it ever go missing
              </div>

              <div className='tooltip-tag__img'>
                <img src={tooltip} alt='' />
              </div>

              <span className='tooltip-tag__link'>Example of a 6 digit Tag-ID</span>
            </div>}
          </div>
        </div>
        <button className='id-form__btn' type='submit'>
          Register item
        </button>
      </form>
    </>
  );
};
