import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../services";

import "./header.css";


export default function Header() {
  const [logged] = useAuth();

  return (
    <div className='header'>
      <div className='container'>
        <div className='header__inner'>
          <nav className='menu'>
            <ul className='menu__list'>
              <li className='menu__item'>
                <Link className="menu__link" to='/'>Home</Link>
              </li>
              
              <li className='menu__item'>
                <Link className="menu__link" to='/register_tag'>Register Tag</Link>
              </li>
              <li className='menu__item'>
                <Link className="menu__link" to='/contact'>Contact</Link>
              </li>
              {logged ?
                <li className='menu__item'>
                  <Link className="menu__link" to='/dashboard'>Dashboard</Link>
                </li>
                 :
                <li className='menu__item'>
                  <Link className="menu__link" to='/login'>Login</Link>
                </li>
              }
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
