import React from "react";
import { Link } from "react-router-dom";

import "./footer.css";
import logo from "../../images/logo.png";
import twitterIcon from "../../images/icons/twitter.svg";
import instagramIcon from "../../images/icons/instagram.svg";
import linkeInIcon from "../../images/icons/linkedin.svg";
import facebookIcon from "../../images/icons/facebook.svg";
import youtubeIcon from "../../images/icons/youtube.svg";

export default function Footer() {
  return (
    <footer className='footer'>
      <div className='full-logo'>
        <img src={logo} alt='full logo' />
      </div>

      <ul className='footer__social'>
        <li className='footer__social-item'>
          <Link className='footer__social-link' to='/'>
            <img src={twitterIcon} alt='twitter' />
          </Link>
        </li>

        <li className='footer__social-item'>
          <Link className='footer__social-link' to='/'>
            <img src={instagramIcon} alt='instagram' />
          </Link>
        </li>

        <li className='footer__social-item'>
          <Link className='footer__social-link' to='/'>
            <img src={linkeInIcon} alt='linkedin' />
          </Link>
        </li>

        <li className='footer__social-item'>
          <Link className='footer__social-link' to='/'>
            <img src={facebookIcon} alt='facebook' />
          </Link>
        </li>

        <li className='footer__social-item'>
          <Link className='footer__social-link' to='/'>
            <img src={youtubeIcon} alt='youtube' />
          </Link>
        </li>
      </ul>

      <ul className='footer__nav'>
        <li className='footer__item'>
          <Link className='footer__link' to='/about'>
            About
          </Link>
        </li>

        <li className='footer__item'>
          <Link className='footer__link' to='/contact-us'>
            Contact us
          </Link>
        </li>

        <li className='footer__item'>
          <Link className='footer__link' to='/terms-and-conditions'>
            Terms
          </Link>
        </li>
      </ul>
    </footer>
  );
}
