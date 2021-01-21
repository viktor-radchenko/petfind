import React from "react";

export default function ModalPublicContact() {
  return (
    <>
      <div className='search-enabled'>
        <span className='title title--modal search-enabled__title'>Found the Owner</span>

        <button className='close'>close</button>

        <div className='search-enabled__box'>
          <div className='search-enabled__avatar'>
            <img src='images/pet-avatar.jpg' alt='dog' />
          </div>

          <div className='search-enabled__info'>
            <span className='search-enabled__tag'>ghay12</span>

            <span className='search-enabled__name'>
              Item name: <span>Marco</span>
            </span>
          </div>
        </div>

        <ul className='search-enabled__list'>
          <li className='search-enabled__item'>
            <span className='search-enabled__cell search-enabled__cell--owner'>Owner Name</span>
            <span className='search-enabled__content'>Riya Jain</span>
          </li>

          <li className='search-enabled__item'>
            <span className='search-enabled__cell search-enabled__cell--phone'>Phone Number</span>
            <span className='search-enabled__content' href='tel:+1230000999'>
              +123(0000)999
            </span>
          </li>

          <li className='search-enabled__item'>
            <span className='search-enabled__cell search-enabled__cell--email'>Email Address</span>
            <span className='search-enabled__content' href='mailto:ho@riyaja.in'>
              ho@riyaja.in
            </span>
          </li>

          <li className='search-enabled__item'>
            <span className='search-enabled__cell search-enabled__cell--address'>Address</span>
            <span className='search-enabled__content'>St Bernards 826400, San Diego California</span>
          </li>
        </ul>
      </div>

      <div className='modal__footer'>
        <button className='button'>Contact Owner</button>
      </div>
    </>
  );
}
