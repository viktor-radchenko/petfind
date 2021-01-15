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

            {logged ? (
              <li className='menu__item'>
                <Link className='menu__link' to='/dashboard'>
                  Dashboard
                </Link>
              </li>
            ) : (
              <li className='menu__item'>
                <Link className='menu__link' to='/login'>
                  Login
                </Link>
              </li>
            )}
          </ul>

          <div className='header__id-form id-form'>
            <input className='id-form__input' type='text' placeholder='Enter Tag ID' />

            <button className='id-form__btn' type='button' onClick={customRedirect}>
              Register item
            </button>
          </div>

          <button className='burger-btn burger-btn--active'>Burger Button</button>
        </nav>
      </div>
    </header>
  );
}
