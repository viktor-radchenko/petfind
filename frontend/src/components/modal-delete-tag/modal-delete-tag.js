import React from "react";
import { deleteRegisteredTag } from "../../services";


export default function ModalDeleteTag({ data, handleUpdate }) {
  const tagId = data.tag_id;

  const handleSubmit = (e, tagId) => {
    e.preventDefault();

    deleteRegisteredTag(tagId)
      .then((res) => res.json())
      .then((res) => {
        handleUpdate(res);
      });
    window.location.reload();
  };

  return (
    <>
      <div className="modal__content">
          <div className="delete-tag">
            <div className="delete-tag__message">
              You are about to delete tag
              <span className="table__item-tag delete-tag__tag">{tagId}</span>
              Do you want to continue?
            </div>

            <button className="button delete-tag__button" onClick={(e) => handleSubmit(e, tagId)}>Delete Tag</button>
          </div>
        </div>
    </>
  );
}
