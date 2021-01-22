import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useAuth, requestPasswordReset } from "../../services";

import validateForm from "./validator";
import logo from "../../images/logo.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const [logged] = useAuth();
  const [errors, setErrors] = useState({});

  const history = useHistory();

  // Redirect logged users
  if (logged) history.push("/dashboard");

  const handleSubmit = (e) => {
    e.preventDefault();

    const values = { email: email };
    const validatedForm = validateForm(values);
    if (Object.keys(validatedForm).length === 0 && validatedForm.constructor === Object) {
      requestPasswordReset(email)
        .then((res) => res.json())
        .then((res) => {
          if (!res.status === "ok") throw Error(res.error);
          setMessage(res.message);
        })
        .catch((e) => setServerError(e));
    } else {
      setErrors(validatedForm);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <>
      <div className='full-logo'>
        <img src={logo} alt='full logo' />
      </div>

      {!message && (
        <section className='set-password'>
          <span className='title auth__title'>Request password reset</span>
          <form className='auth__form' onSubmit={handleSubmit}>
            <label className='label'>
              <span>Email</span>
              <input
                className='input auth__input'
                name='email'
                type='email'
                onChange={handleEmailChange}
                value={email}
              />
              {errors.email && <div className='input-error'>{errors.email}</div>}
              {serverError && <div className='input-error'>{serverError}</div>}
            </label>

            <button className='button set-password__btn' type='submit'>
              Reset Password
            </button>
          </form>
        </section>
      )}

      {message && (
        <div className='password-notify'>
          <span className='title password-notify__title'>Password reset</span>

          <p className='password-notify__text'>{message}</p>
        </div>
      )}
      
      <div className='go-home'>
        <small>
          <Link className='go-home__link' to='/'>
            Cancel and back to home
          </Link>
        </small>
      </div>
    </>
  );
}
