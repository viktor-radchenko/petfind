<section className='dashboard'>
        <div className='dashboard__nav'>
          <a className='logo-noword' href='#'>
            <img src='images/logo-noword.png' alt='logotype' />
          </a>

          <ul className='dashboard__tabs'>
            <li className='dashboard__tab dashboard__tab--dashboard dashboard__tab--active'>Dashboard</li>

            <li className='dashboard__tab dashboard__tab--analytics'>Analytics</li>

            <li className='dashboard__tab dashboard__tab--account'>Account Settings </li>
          </ul>

          <div className='dashboard__username'>
            <div className='dashboard__profile'>
              <div className='dashboard__avatar'>
                <span>RJ</span>
              </div>

              <div className='dashboard__info'>
                <span className='dashboard__name'>Riya Jain</span>

                <span className='dashboard__email'>hi@riyaja.in</span>
              </div>
            </div>

            <button className='dashboard__logout'>Logout</button>
          </div>
        </div>

        <div className='dashboard__content'>
          <div className='dashboard__inner'>
            <div className='dashboard__box'>
              <button className='burger-btn'>Burger Button</button>

              <span className='title dashboard__title'>Dashboard</span>
            </div>

            <form className='dashboard__search'>
              <input className='input dashboard__input' type='text' placeholder='Search by tag ID, name' />

              <button className='button dashboard__btn'>Add New Tag</button>
            </form>

            <ul className='table'>
              <li className='table__item table__item--title'>
                <div className='table__item-img'></div>
                <div className='table__item-tag table__item-tag--title'>tag id</div>
                <div className='table__item-name'>item name</div>
                <div className='table__item-email'>email</div>
                <div className='table__item-number'>number</div>
                <div className='table__item-address'>address</div>
                <div className='table__item-state table__item-state--title'>state</div>
                <div className='table__item-actions'>actions</div>
              </li>

              <li className='table__item'>
                <div className='table__item-img'>
                  <img src='images/pet-img.jpg' alt='pet' />
                </div>
                <span className='table__item-tag'>ghay12</span>
                <span className='table__item-name'>Marco</span>
                <div className='table__item-email'>
                  <a href='mailto:hi@riyaja.in'>hi@riyaja.in</a>
                </div>
                <div className='table__item-number'>
                  <a href='tel:+4122090500'>+412(2090)500</a>
                </div>
                <address className='table__item-address'>St. Bernard road</address>
                <div className='table__item-state'>
                  <label className='switch'>
                    <input className='switch__input' type='checkbox' />
                    <span className='switch__slider'></span>
                  </label>
                </div>
                <form className='table__item-actions table__item-actions--active'>
                  <button className='table__item-btn table__item-btn--diagram'>analytics</button>
                  <button className='table__item-btn table__item-btn--edit'>edit</button>
                  <button className='table__item-btn table__item-btn--lock'>lock</button>
                  <button className='table__item-btn table__item-btn--delete'>delete</button>
                </form>
                <button className='dropdown dropdown--active'>dropdown</button>
              </li>

              <li className='table__item'>
                <div className='table__item-img'>
                  <img src='images/pet-img.jpg' alt='pet' />
                </div>
                <span className='table__item-tag'>ghay12</span>
                <span className='table__item-name'>Marco</span>
                <div className='table__item-email'>
                  <a href='mailto:hi@riyaja.in'>hi@riyaja.in</a>
                </div>
                <div className='table__item-number'>
                  <a href='tel:+4122090500'>+412(2090)500</a>
                </div>
                <address className='table__item-address'>St. Bernard road</address>
                <div className='table__item-state'>
                  <label className='switch'>
                    <input className='switch__input' type='checkbox' />
                    <span className='switch__slider'></span>
                  </label>
                </div>
                <form className='table__item-actions'>
                  <button className='table__item-btn table__item-btn--diagram'>analytics</button>
                  <button className='table__item-btn table__item-btn--edit'>edit</button>
                  <button className='table__item-btn table__item-btn--lock'>lock</button>
                  <button className='table__item-btn table__item-btn--delete'>delete</button>
                </form>
                <button className='dropdown'>dropdown</button>
              </li>

              <li className='table__item'>
                <div className='table__item-img'>
                  <img src='images/pet-img.jpg' alt='pet' />
                </div>
                <span className='table__item-tag'>ghay12</span>
                <span className='table__item-name'>Marco</span>
                <div className='table__item-email'>
                  <a href='mailto:hi@riyaja.in'>hi@riyaja.in</a>
                </div>
                <div className='table__item-number'>
                  <a href='tel:+4122090500'>+412(2090)500</a>
                </div>
                <address className='table__item-address'>St. Bernard road</address>
                <div className='table__item-state'>
                  <label className='switch'>
                    <input className='switch__input' type='checkbox' />
                    <span className='switch__slider'></span>
                  </label>
                </div>
                <form className='table__item-actions'>
                  <button className='table__item-btn table__item-btn--diagram'>analytics</button>
                  <button className='table__item-btn table__item-btn--edit'>edit</button>
                  <button className='table__item-btn table__item-btn--lock'>lock</button>
                  <button className='table__item-btn table__item-btn--delete'>delete</button>
                </form>
                <button className='dropdown'>dropdown</button>
              </li>

              <li className='table__item'>
                <div className='table__item-img'>
                  <img src='images/pet-img.jpg' alt='pet' />
                </div>
                <span className='table__item-tag'>ghay12</span>
                <span className='table__item-name'>Marco</span>
                <div className='table__item-email'>
                  <a href='mailto:hi@riyaja.in'>hi@riyaja.in</a>
                </div>
                <div className='table__item-number'>
                  <a href='tel:+4122090500'>+412(2090)500</a>
                </div>
                <address className='table__item-address'>St. Bernard road</address>
                <div className='table__item-state'>
                  <label className='switch'>
                    <input className='switch__input' type='checkbox' />
                    <span className='switch__slider'></span>
                  </label>
                </div>
                <form className='table__item-actions'>
                  <button className='table__item-btn table__item-btn--diagram'>analytics</button>
                  <button className='table__item-btn table__item-btn--edit'>edit</button>
                  <button className='table__item-btn table__item-btn--lock'>lock</button>
                  <button className='table__item-btn table__item-btn--delete'>delete</button>
                </form>
                <button className='dropdown'>dropdown</button>
              </li>

              <li className='table__item'>
                <div className='table__item-img'>
                  <img src='images/pet-img.jpg' alt='pet' />
                </div>
                <span className='table__item-tag'>ghay12</span>
                <span className='table__item-name'>Marco</span>
                <div className='table__item-email'>
                  <a href='mailto:hi@riyaja.in'>hi@riyaja.in</a>
                </div>
                <div className='table__item-number'>
                  <a href='tel:+4122090500'>+412(2090)500</a>
                </div>
                <address className='table__item-address'>St. Bernard road</address>
                <div className='table__item-state'>
                  <label className='switch'>
                    <input className='switch__input' type='checkbox' />
                    <span className='switch__slider'></span>
                  </label>
                </div>
                <form className='table__item-actions'>
                  <button className='table__item-btn table__item-btn--diagram'>analytics</button>
                  <button className='table__item-btn table__item-btn--edit'>edit</button>
                  <button className='table__item-btn table__item-btn--lock'>lock</button>
                  <button className='table__item-btn table__item-btn--delete'>delete</button>
                </form>
                <button className='dropdown'>dropdown</button>
              </li>

              <li className='table__item'>
                <div className='table__item-img'>
                  <img src='images/pet-img.jpg' alt='pet' />
                </div>
                <span className='table__item-tag'>ghay12</span>
                <span className='table__item-name'>Marco</span>
                <div className='table__item-email'>
                  <a href='mailto:hi@riyaja.in'>hi@riyaja.in</a>
                </div>
                <div className='table__item-number'>
                  <a href='tel:+4122090500'>+412(2090)500</a>
                </div>
                <address className='table__item-address'>St. Bernard road</address>
                <div className='table__item-state'>
                  <label className='switch'>
                    <input className='switch__input' type='checkbox' />
                    <span className='switch__slider'></span>
                  </label>
                </div>
                <form className='table__item-actions'>
                  <button className='table__item-btn table__item-btn--diagram'>analytics</button>
                  <button className='table__item-btn table__item-btn--edit'>edit</button>
                  <button className='table__item-btn table__item-btn--lock'>lock</button>
                  <button className='table__item-btn table__item-btn--delete'>delete</button>
                </form>
                <button className='dropdown'>dropdown</button>
              </li>

              <li className='table__item'>
                <div className='table__item-img'>
                  <img src='images/pet-img.jpg' alt='pet' />
                </div>
                <span className='table__item-tag'>ghay12</span>
                <span className='table__item-name'>Marco</span>
                <div className='table__item-email'>
                  <a href='mailto:hi@riyaja.in'>hi@riyaja.in</a>
                </div>
                <div className='table__item-number'>
                  <a href='tel:+4122090500'>+412(2090)500</a>
                </div>
                <address className='table__item-address'>St. Bernard road</address>
                <div className='table__item-state'>
                  <label className='switch'>
                    <input className='switch__input' type='checkbox' />
                    <span className='switch__slider'></span>
                  </label>
                </div>
                <form className='table__item-actions'>
                  <button className='table__item-btn table__item-btn--diagram'>analytics</button>
                  <button className='table__item-btn table__item-btn--edit'>edit</button>
                  <button className='table__item-btn table__item-btn--lock'>lock</button>
                  <button className='table__item-btn table__item-btn--delete'>delete</button>
                </form>
                <button className='dropdown'>dropdown</button>
              </li>

              <div className='table__bottom'>
                <div className='pagination'>
                  <button className='pagination__arrow pagination__arrow--left'></button>

                  <ul className='pagination__list'>
                    <li className='pagination__item'>
                      <a className='pagination__link pagination__link--active' href='#'>
                        1
                      </a>
                    </li>

                    <li className='pagination__item'>
                      <a className='pagination__link' href='#'>
                        2
                      </a>
                    </li>

                    <li className='pagination__item'>
                      <a className='pagination__link' href='#'>
                        3
                      </a>
                    </li>

                    <li className='pagination__item'>
                      <a className='pagination__link' href='#'>
                        4
                      </a>
                    </li>

                    <li className='pagination__item'>
                      <a className='pagination__link' href='#'>
                        5
                      </a>
                    </li>
                  </ul>

                  <button className='pagination__arrow pagination__arrow--right'></button>
                </div>
              </div>
            </ul>

            <div className='buy-tags'>
              <div className='buy-tags__top'>
                <span className='title buy-tags__title'>Buy Tags</span>

                <a className='tags__more buy-tags__more' href='#'>
                  See all
                </a>
              </div>

              <div className='buy-tags__content'>
                <article className='tag-card'>
                  <div className='tag-card__top'>
                    <div className='tag-card__img'>
                      <img src='images/tag-img.jpg' alt='tag' />
                    </div>

                    <div className='tag-card__details'>
                      <a className='tag-card__title' href='#'>
                        Bow Tie Pet Tag
                      </a>

                      <button className='tag-card__btn' type='button'>
                        $100
                      </button>
                    </div>

                    <span className='tag-card__desc'>Engrave - Memories, Etched Forever!</span>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>