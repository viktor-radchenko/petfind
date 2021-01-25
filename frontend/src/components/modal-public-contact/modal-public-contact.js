import React from "react";

export default function ModalPublicContact({ lookUpData }) {
  const { tag_image, tag_id, tag_name, name, phone, email, address } = lookUpData.data;

  return (
    <div>
      <div className='search-enabled'>
        <span className='title title--modal search-enabled__title'>Found the Owner</span>

        <div className='search-enabled__box'>
          <div className='search-enabled__avatar'>
            <img src={`/uploads/tag_image/${tag_image}`} alt='' />
          </div>

          <div className='search-enabled__info'>
            <span className='search-enabled__tag'>{tag_id}</span>

            <span className='search-enabled__name'>
              Item name: <span>{tag_name}</span>
            </span>
          </div>
        </div>

        <ul className='search-enabled__list'>
          <li className='search-enabled__item'>
            <span className='search-enabled__cell search-enabled__cell--owner'>Owner Name</span>
            <span className='search-enabled__content'>{name}</span>
          </li>

          <li className='search-enabled__item'>
            <span className='search-enabled__cell search-enabled__cell--phone'>Phone Number</span>
            <span className='search-enabled__content'>
              {phone}
            </span>
          </li>

          <li className='search-enabled__item'>
            <span className='search-enabled__cell search-enabled__cell--email'>Email Address</span>
            <span className='search-enabled__content'>
              {email}
            </span>
          </li>

          <li className='search-enabled__item'>
            <span className='search-enabled__cell search-enabled__cell--address'>Address</span>
            <span className='search-enabled__content'>{address}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
