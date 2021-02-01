import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useAuth, resendConfirmationEmail } from "../../services";

import logo from "../../images/logo.png";

export default function ConfirmationPending() {
  const [serverError, setServerError] = useState("");
  const [resendLink, setResendLink] = useState("");
  
  const [logged] = useAuth();
  const history = useHistory();

  if (logged) history.push("/dashboard");

  const email = localStorage.getItem("confirmation_pending");

  const handleResend = () => {
    resendConfirmationEmail(email)
      .then((res) => {
        if (!res.ok) throw new Error("Internal server error. Please try again or contact support for help");
        return res.json();
      })
      .then((res) => {
        if (res.error) setServerError(res.error);
        if (res.message) {
          setResendLink(res.message);
          };
        })
      .catch((e) => alert(e));
  };

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

        <button onClick={handleResend} className='password-notify__link'>Resend confirmation link</button>
        {resendLink && <div className="password-notify__resend">{resendLink}</div>}
      </section>

      <div className='go-home'>
        <Link className='go-home__link' to='/'>
          Cancel and back to home
        </Link>
      </div>
    </>
  );
}
