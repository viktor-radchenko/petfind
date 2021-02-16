import React, { useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import { useAuth, login } from "../../services";

import logo from "../../images/logo.png";
import validateForm from "./validator";

export default function SetPassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { token } = useParams();
  const [logged] = useAuth();
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState();

  const history = useHistory();

  if (logged) {
    history.push("/dashboard");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    let opts = {
      oldPassword: oldPassword,
      newPassword: newPassword,
      token: token,
    };
    const validatedForm = validateForm(opts);
    if (Object.keys(validatedForm).length === 0 && validatedForm.constructor === Object) {
      fetch("/api/auth/verify", {
        method: "post",
        body: JSON.stringify(opts),
      })
        .then((res) => {
          if (!res.ok)
            throw new Error(
              "We were unable to authorise your account. This might be caused by a server error. Please contact support to resolve this issue"
            );
          return res.json();
        })
        .then((res) => {
          if (res.access_token) {
            login(res);
          }
        })
        .catch((e) => setServerError(e.message));
    } else {
      setErrors(validatedForm);
    }
  };

  const handleOldPassChange = (e) => {
    setOldPassword(e.target.value);
  };

  const handleNewPassChange = (e) => {
    setNewPassword(e.target.value);
  };

  return (
    <>
      <Link className='full-logo' to='/'>
        <img src={logo} alt='full logo' />
      </Link>

      <section className='set-password'>
        <span className='title auth__title'>Set Your Password</span>

        <form className='auth__form' onSubmit={handleSubmit}>
          <label className='label'>
            <span>Old Password</span>
            <input
              className='input auth__input'
              name='oldPassword'
              type='password'
              onChange={handleOldPassChange}
              value={oldPassword}
            />
            {errors.oldPassword && <div className='input-error input-error--main'>{errors.oldPassword}</div>}
          </label>

          <label className='label'>
            <span>New Password</span>
            <input
              className='input auth__input'
              name='newPassword'
              type='password'
              onChange={handleNewPassChange}
              value={newPassword}
            />
            {errors.newPassword && <div className='input-error input-error--main'>{errors.newPassword}</div>}
          </label>

          {serverError && <div className='input-error input-error--main'>{serverError}</div>}

          <button className='button set-password__btn' type='submit'>
            Change Password
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
