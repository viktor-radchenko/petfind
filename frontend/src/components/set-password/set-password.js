import React, { useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import { useAuth, login, logout } from "../../services";

export default function SetPassword() {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const { token } = useParams();
  const [logged] = useAuth();
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
      password: password,
      passwordConfirmation: passwordConfirmation,
      token: token,
    };
    console.log(opts);
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
  };

  const handlePassChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePassConfirmationChange = (e) => {
    setPasswordConfirmation(e.target.value);
  };

  return (
    <>
      <section className='set-password'>
        <span className='title auth__title'>Set Your Password</span>

        <form className='auth__form' action='#'>
          <label className='label'>
            <span>Old Password</span>
            <input className='input auth__input' type='password' onChange={handlePassChange} value={password} />
          </label>

          <label className='label'>
            <span>New Password</span>
            <input
              className='input auth__input'
              type='password'
              onChange={handlePassConfirmationChange}
              value={passwordConfirmation}
            />
          </label>

          <button className='button set-password__btn' type='submit' onClick={onSubmitClick}>
            Change Password
          </button>
        </form>
      </section>
      <div classN="go-home">
        <small><Link classN="go-home__link" to="/">Cancel  and back to home</Link></small>
      </div>
    </>
  );
}
