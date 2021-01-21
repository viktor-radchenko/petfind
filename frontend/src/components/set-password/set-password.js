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
    console.log("You pressed submit passwords");
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
            console.log(token);
          } else {
            console.log("Please check if your passwords are correct password");
          }
        });
    } else {
      console.log('Passwords: updating errors:', validatedForm)
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
          </label>
          {errors.oldPassword && <span>{errors.oldPassword}</span>}

          <label className='label'>
            <span>New Password</span>
            <input
              className='input auth__input'
              name='newPassword'
              type='password'
              onChange={handleNewPassChange}
              value={newPassword}
            />
          </label>
          {errors.newPassword && <span>{errors.newPassword}</span>}


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
