import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../services";

import NewTagForm from '../new-tag-form.js'

import "./header.css";
import homeLogo from "../../images/home-logo.png";

export default function Header() {
  const [logged] = useAuth();
  const [menuActive, setMenuActive] = useState(false);

  return (
    <header className='header'>
      <div className='container'>
        <nav className='header__inner'>
          <div className='logo'>
            <img src={homeLogo} alt='logotype' />
          </div>

          <ul className={menuActive ? 'menu menu--active' : 'menu'}>
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
                <NewTagForm />
              </li>
            ) : (
              <div className='menu-dashboard'>
                <Link className='menu-dashboard__loggedin' to="/dashboard">
                  Dashboard
                </Link>
              </div>
            )}
          </ul>

          <button className={menuActive ? 'burger-btn burger-btn--active' : 'burger-btn'} onClick={() => setMenuActive(!menuActive)}>Burger Button</button>
        </nav>
      </div>
    </header>
  );
}
