import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../services";

import "./header.css";
import homeLogo from "../../images/home-logo.png";

export default function Header() {
  const [logged] = useAuth();
  const history = useHistory();

  const customRedirect = () => {
    history.push("/register_tag");
  };

  return (
    <header className='header'>
      <div className='container'>
        <nav className='header__inner'>
          <div className='logo'>
            <img src={homeLogo} alt='logotype' />
          </div>

          <ul className='menu'>
            <li className='menu__item'>
              <Link className='menu__link' to='/contact-us'>
                Contact Us
              </Link>
            </li>

            {logged ? null : (
              <li className='menu__item'>
                <Link className='menu__link' to='/login'>
                  Login
                </Link>
              </li>
            )}
            {!logged ? (
              <li className='menu__item menu__item--form'>
                <div className='header__id-form id-form'>
                  <div className='id-form__box'>
                    <input className='id-form__input' type='text' placeholder='Enter Tag ID' />

                    <div className='tooltip-tag'>
                      <div className='tooltip-tag__id'>
                        <div className='tooltip-tag__text'>
                          The <span>six digit number on the back of the tag</span> is your items unique code that is
                          used to find it if it ever go missing
                        </div>

                        <div className='tooltip-tag__img'>
                          <img src='images/tooltip-img.jpg' alt='' />
                        </div>

                        <span className='tooltip-tag__link'>Example of a 6 digit Tag-ID</span>
                      </div>
                    </div>
                  </div>
                  <button className='id-form__btn' type='button' onClick={customRedirect}>
                    Register item
                  </button>
                </div>
              </li>
            ) : (
              <div className='menu-dashboard'>
                <Link className='menu-dashboard__loggedin' to="/dashboard">
                  Dashboard
                </Link>
              </div>
            )}
          </ul>

          <button className='burger-btn burger-btn--active'>Burger Button</button>
        </nav>
      </div>
    </header>
  );
}
