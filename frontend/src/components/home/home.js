import React, { useState, useEffect } from "react";


export default function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api")
      .then((resp) => resp.json())
      .then((resp) => setMessage(resp.message));
  }, []);

  return (
    <section className="home">
      <div className="container">
        <div className="home__inner">
          <h2>{message}</h2>
        </div>
      </div>
    </section>
  );
}
