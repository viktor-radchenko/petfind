import React from "react";
import { useHistory, Link } from "react-router-dom";
import { useAuth } from "../../services";

import logo from "../../images/logo.png";

export default function ConfirmationPending() {
  const [logged] = useAuth();
  const history = useHistory();

  if (logged) history.push("/dashboard");

  const email = localStorage.getItem("confirmation_pending");
  return (
    <>
      <div className='full-logo'>
        <img src={logo} alt='full logo' />
      </div>

      <section className='password-notify'>
        <span className='title password-notify__title'>Confirm your account</span>

        <p className='password-notify__text'>
          You need to confirm your account a password. Check your inbox at {email}. Alternatively, you can request a new
          confirmation email by pressing a button below
        </p>

        <button className='password-notify__link'>Resend confirmation link</button>
      </section>

      <div className='go-home'>
        <Link className='go-home__link' to='/'>
          Cancel and back to home
        </Link>
      </div>
    </>
  );
}
