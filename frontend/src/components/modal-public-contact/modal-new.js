<div className='search-enabled'>
            <span className='title title--modal search-enabled__title'>Found the Owner</span>

            <button className='close' onClick={handleCloseBtn}>close</button>

            <div className='search-enabled__box'>
              <div className='search-enabled__avatar'>
                <img src={`/uploads/tag_image/${lookUpData.tag_image}`} alt='' />
              </div>

              <div className='search-enabled__info'>
                <span className='search-enabled__tag'>{lookUpData.tag_id}</span>

                <span className='search-enabled__name'>
                  Item name: <span>{lookUpData.tag_name}</span>
                </span>
              </div>
            </div>

            <ul className='search-enabled__list'>
              <li className='search-enabled__item'>
                <span className='search-enabled__cell search-enabled__cell--owner'>Owner Name</span>
                <span className='search-enabled__content'>{lookUpData.name}</span>
              </li>

              <li className='search-enabled__item'>
                <span className='search-enabled__cell search-enabled__cell--phone'>Phone Number</span>
                <span className='search-enabled__content' href={`tel:${lookUpData.phone}`}>
                  {lookUpData.phone}
                </span>
              </li>

              <li className='search-enabled__item'>
                <span className='search-enabled__cell search-enabled__cell--email'>Email Address</span>
                <span className='search-enabled__content' href={`mailto:${lookUpData.email}`}>
                  {lookUpData.email}
                </span>
              </li>

              <li className='search-enabled__item'>
                <span className='search-enabled__cell search-enabled__cell--address'>Address</span>
                <span className='search-enabled__content'>{lookUpData.address}</span>
              </li>
            </ul>
          </div>