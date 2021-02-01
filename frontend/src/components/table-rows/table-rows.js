import React, { useState, useRef } from "react";
import { updateRegisteredTag } from "../../services";

import ModalWrapper from "../modal-wrapper";
import ModalEditTag from "../modal-edit-tag";
import ModalDeleteTag from "../modal-delete-tag";
import ModalAnalytics from "../modal-analytics";

export default function TableRows({ rows, loading, handleUpdate }) {
  const [rowState, setRowState] = useState({});
  const [activeRowId, setActiveRowId] = useState();
  const editModal = useRef(null);
  const deleteModal = useRef(null);
  const analyticsModal = useRef(null);

  if (loading) {
    return <h1>LOADING...</h1>;
  }

  const handlePrivateBtn = (e, row) => {
    e.preventDefault();
    const privateRes = row.is_private ? false : true;

    updateRegisteredTag(row.tag_id, { isPrivate: privateRes })
      .then((res) => res.json())
      .then((res) => {
        handleUpdate(res);
      });
  };

  const toggleAnalyticsModal = (e, row) => {
    e.preventDefault();
    setRowState(row);
    analyticsModal.current.open();
  };

  const toggleEditModal = (e, row) => {
    e.preventDefault();
    setRowState(row);
    editModal.current.open();
  };

  const toggleDeleteModal = (e, row) => {
    e.preventDefault();
    setRowState(row);
    deleteModal.current.open();
  };

  const handleStatusBtn = (e, row) => {
    e.preventDefault();
    const statusRes = row.status === "enabled" ? "disabled" : "enabled";

    updateRegisteredTag(row.tag_id, { tagStatus: statusRes, isPrivate: row.is_private })
      .then((res) => res.json())
      .then((res) => {
        handleUpdate(res);
      });
  };

  console.log(rowState)

  return (
    <>
      <ul className='table__content'>
        {rows.map((row) => (
          <li key={row.tag_id} className='table__row'>
            <div className='table__item-img'>
              <img src={`/uploads/tag_image/${row.tag_image}`} alt='pet' />
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
              <div>{row.is_private && <span className='table__item-state--block'></span>}</div>
            </div>
            <div
              className={
                activeRowId === row.tag_id ? "table__item-actions table__item-actions--active" : "table__item-actions"
              }>
              <button
                onMouseDown={(e) => toggleAnalyticsModal(e, row)}
                className='table__item-btn table__item-btn--diagram'>
                analytics
              </button>
              <button onMouseDown={(e) => toggleEditModal(e, row)} className='table__item-btn table__item-btn--edit'>
                edit
              </button>
              <button onMouseDown={(e) => handlePrivateBtn(e, row)} className='table__item-btn table__item-btn--lock'>
                lock
              </button>
              <button onMouseDown={(e) => toggleDeleteModal(e, row)} className='table__item-btn table__item-btn--delete'>
                delete
              </button>
            </div>
            <button
              className={activeRowId === row.tag_id ? "dropdown dropdown--active" : "dropdown"}
              onClick={() => (activeRowId ? setActiveRowId("") : setActiveRowId(row.tag_id))}
              onBlur={() => setActiveRowId("")}>
              dropdown
            </button>
          </li>
        ))}
      </ul>
      <ModalWrapper header={"Delete tag"} ref={deleteModal}>
        <ModalDeleteTag data={rowState} handleUpdate={handleUpdate} />
      </ModalWrapper>
      <ModalWrapper header={"Edit tag"} ref={editModal}>
        <ModalEditTag data={rowState} />
      </ModalWrapper>
      <ModalWrapper header={"Tag search history"} ref={analyticsModal}>
        <ModalAnalytics data={rowState} />
      </ModalWrapper>
    </>
  );
}
