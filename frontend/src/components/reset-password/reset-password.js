import React, { useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import { useAuth, login, resetPassword } from "../../services";

import validateForm from "./validator";
import logo from "../../images/logo.png";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState();

  const { token } = useParams();
  const [logged] = useAuth();
  const history = useHistory();

  if (logged) history.push("/");

  const handleSubmit = (e) => {
    e.preventDefault();

    const values = {
      password: password,
      passwordConfirmation: passwordConfirmation,
    };

    const validatedForm = validateForm(values);
    if (Object.keys(validatedForm).length === 0 && validatedForm.constructor === Object) {
      resetPassword(password, passwordConfirmation, token)
        .then((res) => {
          if (!res.ok) throw Error(res);
          res.json();
        })
        .then((res) => {
          console.log("Received RES", res);
          if (!res.access_token) throw Error(res.error);
          login(res.access_token);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      setErrors(validatedForm);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordConfirmationChange = (e) => {
    setPasswordConfirmation(e.target.value);
  };

  return (
    <>
      <div className='full-logo'>
        <img src={logo} alt='full logo' />
      </div>

      <section className='set-password'>
        <span className='title auth__title'>Set Your Password</span>

        <form className='auth__form' onSubmit={handleSubmit}>
          <label className='label'>
            <span>Old Password</span>
            <input
              className='input auth__input'
              name='password'
              type='password'
              onChange={handlePasswordChange}
              value={password}
            />
            {errors.password && <div className='input-error input-error--main'>{errors.password}</div>}
          </label>

          <label className='label'>
            <span>New Password</span>
            <input
              className='input auth__input'
              name='passwordConfirmation'
              type='password'
              onChange={handlePasswordConfirmationChange}
              value={passwordConfirmation}
            />
            {errors.passwordConfirmation && (
              <div className='input-error input-error--main'>{errors.passwordConfirmation}</div>
            )}
          </label>

          {/* {serverError && <div className='input-error'>{serverError}</div>} */}

          <button className='button set-password__btn' type='submit'>
            Set New Password
          </button>
        </form>
      </section>
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
