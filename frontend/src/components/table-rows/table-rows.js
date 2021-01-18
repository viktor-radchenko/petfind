import React from "react";

import icon from '../../images/pet-avatar.jpg';

export default function TableRows({ rows, loading }) {
  if (loading) {
    return <h1>LOADING...</h1>
  }
  
  console.log("TABLE ROW DATA", rows);


  const handleAnalyticsBtn = (e, id) => {
    e.preventDefault();
    alert(`Analytics button with tag ID "${id}" was clicked!`);
  };
  const handlePrivateBtn = (e, id) => {
    e.preventDefault();
    alert(`Private button with tag ID "${id}" was clicked!`);
  };
  const handleEditBtn = (e, id) => {
    e.preventDefault();
    alert(`Edit button with tag ID "${id}" was clicked!`);
  };
  const handleDeleteBtn = (e, id) => {
    e.preventDefault();
    alert(`Delete button with tag ID "${id}" was clicked!`);
  };

  return (
    <ul className='table'>
      {rows.map((row) => (
        <li key={row.tag_id} className='table__item'>
          <div className='table__item-img'>
            <img src={icon} alt='pet' />
          </div>
          <span className='table__item-tag'>{row.tag_id}</span>
          <span className='table__item-name'>{row.tag_name}</span>
          <div className='table__item-email'>
            <a href={`mailto:${row.email}`}>{row.email}</a>
          </div>
          <div className='table__item-number'>
            <a href={`tel:${row.phone}`}>{row.phone}</a>
          </div>
          <address className='table__item-address'>{row.address}</address>
          <div className='table__item-state'>
            <label className='switch'>
              <input className='switch__input' type='checkbox' />
              <span className='switch__slider'></span>
            </label>
          </div>
          <form className='table__item-actions'>
            <button onClick={(e) => handleAnalyticsBtn(e, row.tag_id)} className='table__item-btn table__item-btn--diagram'>
              analytics
            </button>
            <button onClick={(e) => handlePrivateBtn(e, row.tag_id)} className='table__item-btn table__item-btn--edit'>
              edit
            </button>
            <button onClick={(e) => handleEditBtn(e, row.tag_id)} className='table__item-btn table__item-btn--lock'>
              lock
            </button>
            <button onClick={(e) => handleDeleteBtn(e, row.tag_id)} className='table__item-btn table__item-btn--delete'>
              delete
            </button>
          </form>
          <button className='dropdown'>dropdown</button>
        </li>)
      )}
    </ul>
  );
}
