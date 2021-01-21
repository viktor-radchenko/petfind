import React, { useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import { useAuth, login } from "../../services";

import validateForm from "./validator";

export default function SetPassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { token } = useParams();
  const [logged] = useAuth();
  const [errors, setErrors] = useState({});

  const history = useHistory();

  if (logged) {
    const redirect = () => {
      history.push("/");
    };

    redirect();
  }

  const onSubmitClick = (e) => {
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
        .then((r) => r.json())
        .then((token) => {
          if (token.access_token) {
            login(token);
          } else {
          }
        });
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
      <section className='set-password'>
        <span className='title auth__title'>Set Your Password</span>

        <form className='auth__form' action='#'>
          <label className='label'>
            <span>Old Password</span>
            <input
              className='input auth__input'
              name='oldPassword'
              type='password'
              onChange={handleOldPassChange}
              value={oldPassword}
            />
          {errors.oldPassword && <div className="input-error">{errors.oldPassword}</div>}
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
          {errors.newPassword && <div className="input-error">{errors.newPassword}</div>}
          </label>


          <button className='button set-password__btn' type='submit' onClick={onSubmitClick}>
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
