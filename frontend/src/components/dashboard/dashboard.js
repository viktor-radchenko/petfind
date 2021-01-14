import React, { useState, useEffect } from 'react';
import { authFetch, logout } from "../../services";

import './dashboard.css';


export default function Dasboard() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    authFetch("/api/protected")
      .then((response) => {
        if (response.status === 401) {
          setMessage("Sorry you aren't authorized!");
          return null;
        }
        return response.json();
      })
      .then((response) => {
        if (response && response.message) {
          setMessage(response.message);
        }
      });
  }, []);

  return (
    <>
      <h2>Dasboard: {message}</h2>
      <button onClick={() => logout()}>Logout</button>
    </>
  );
}