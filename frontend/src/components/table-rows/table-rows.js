import React, { useState, useRef } from "react";
import { updateRegisteredTag } from "../../services";

import ModalWrapper from "../modal-wrapper";
import ModalEditTag from "../modal-edit-tag";

import icon from "../../images/pet-avatar.jpg";

export default function TableRows({ rows, loading, handleUpdate }) {
  const [rowState, setRowState] = useState({});
  const modal = useRef(null);

  if (loading) {
    return <h1>LOADING...</h1>;
  }

  console.log(rows);

  const handleAnalyticsBtn = (e, id) => {
    e.preventDefault();
    alert(`Analytics button with tag ID "${id}" was clicked!`);
  };

  const handlePrivateBtn = (e, row) => {
    e.preventDefault();
    const privateRes = row.is_private ? false : true;

    updateRegisteredTag(row.tag_id, { isPrivate: privateRes })
      .then((res) => res.json())
      .then((res) => {
        handleUpdate(res);
      });
  };
  
  const toggleModal = (e, row) => {
    e.preventDefault();
    console.log("Sending row for editing", row);
    setRowState(row);
    modal.current.open()
  }

  const handleDeleteBtn = (e, id) => {
    e.preventDefault();
    alert(`Delete button with tag ID "${id}" was clicked!`);
  };

  const handleStatusBtn = (e, row) => {
    e.preventDefault();
    const statusRes = row.status === "enabled" ? "disabled" : "enabled";

    updateRegisteredTag(row.tag_id, { tagStatus: statusRes })
      .then((res) => res.json())
      .then((res) => {
        handleUpdate(res);
      });
  };

  return (
    <>
      <ul className='table__content'>
        {rows.map((row) => (
          <li key={row.tag_id} className='table__row'>
            <div className='table__item-img'>
              <img src={icon} alt='pet' />
            </div>
            <span className='table__item-tag'>{row.tag_id}</span>
            <span className='table__item-name'>{row.tag_name}</span>
            <div className='table__item-email'>
              <span>{row.email}</span>
            </div>
            <div className='table__item-number'>
              <span>{row.phone}</span>
            </div>
            <div className='table__item-address'>{row.address}</div>
            <div className='table__item-state'>
              <label className='switch'>
                <input
                  className='switch__input'
                  type='checkbox'
                  checked={row.status === "enabled" ? true : false}
                  onChange={(e) => handleStatusBtn(e, row)}
                />
                <span className='switch__slider'></span>
              </label>
              {row.is_private && <span class="table__item-state--block"></span>}
            </div>
            <form className='table__item-actions'>
              <button
                onClick={(e) => handleAnalyticsBtn(e, row.tag_id)}
                className='table__item-btn table__item-btn--diagram'>
                analytics
              </button>
              <button onClick={(e) => toggleModal(e, row)} className='table__item-btn table__item-btn--edit'>
                edit
              </button>
              <button onClick={(e) => handlePrivateBtn(e, row)} className='table__item-btn table__item-btn--lock'>
                lock
              </button>
              <button
                onClick={(e) => handleDeleteBtn(e, row.tag_id)}
                className='table__item-btn table__item-btn--delete'>
                delete
              </button>
            </form>
            <button className='dropdown'>dropdown</button>
          </li>
        ))}
      </ul>
      <ModalWrapper header={"Edit tag"} ref={modal}>
        <ModalEditTag data={rowState}/>
      </ModalWrapper>
    </>
  );
}