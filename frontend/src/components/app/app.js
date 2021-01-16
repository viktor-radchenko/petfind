import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Header from "../header";
import Home from "../home";
import Login from "../login";
import Dasboard from "../dashboard";
import SetPassword from "../set-password";
import RegisterTagForm from "../register-tag-form";
import Footer from "../footer";
import PrivateRoute from "../hoc";

import "./app.css";

export default function App() {
  const [location, setLocation] = useState(null);
  console.log(location);

  const fetchLocation = async () => {
    return await fetch("https://geolocation-db.com/json/c0593a60-4159-11eb-80cd-db15f946225f")
    .then((res) => res.json())
  }
  useEffect(() => {
    fetchLocation().then(res => setLocation(res))
  }, []);

  return (
    <Router>
      <Switch>
        <Route path='/contact-us'>Contact us Page coming soon</Route>
        <Route path='/terms-and-conditions'>Terms and conditions page coming soon</Route>
        <Route path='/about'>About page coming soon</Route>
        <Route path='/login'>
          <Login />
        </Route>
        <Route path='/register_tag'>
          <RegisterTagForm />
        </Route>
        <Route path='/auth/set-password/:token'>
          <SetPassword />
        </Route>
        <PrivateRoute path='/dashboard' component={Dasboard} />
        <Route path='/'>
          <Header />
          <Home />
          <Footer />
        </Route>
      </Switch>
    </Router>
  );
}
