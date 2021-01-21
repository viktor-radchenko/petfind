import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { login, useAuth } from "../../services";

import logo from "../../images/logo.png";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [serverFeedback, setServerFeedback] = useState("");

  const [logged] = useAuth();
  const history = useHistory();

  if (logged) history.push("/");

  const onSubmitClick = (e) => {
    e.preventDefault();
    let opts = {
      username: username,
      password: password,
    };
    fetch("/api/auth/login", {
      method: "post",
      body: JSON.stringify(opts),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.access_token) {
          login(res);
        } else {
          setServerFeedback(res)
        }
      })
      .catch((e) => console.log(e));
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <>
      <div className='full-logo'>
        <img src={logo} alt='full logo' />
      </div>

      <div className='auth'>
        <span className='auth__subtitle'>Welcome back!</span>
        <span className='title auth__title'>Login your account</span>

        <form className='auth__form' action='#'>
          <label className='label'>
            <span>Email Address</span>
            <input className='input auth__input' type='email' onChange={handleUsernameChange} value={username} />
          </label>

          <label className='label'>
            <span>Password</span>
            <input className='input auth__input' type='password' onChange={handlePasswordChange} value={password} />
          </label>

          {serverFeedback && <div class="input-error">{serverFeedback.message}</div>}

          <div className='auth__password'>
            <label className='label auth__label'>
              <input className='input auth__input-checkbox' type='checkbox' />
              <span className='auth__checkbox'></span>
              <span>Remember me</span>
            </label>

            <Link className='auth__forgot' to='/forgot-password'>
              Forgot your password?
            </Link>
          </div>

          <button className='button' type='submit' onClick={onSubmitClick}>
            Login
          </button>

          <span className='auth__sign-up'>
            No account yet?
            <Link className='auth__forgot' to='/register'>
              Sign up
            </Link>
          </span>
        </form> 
      </div>
    </>
  );
}
