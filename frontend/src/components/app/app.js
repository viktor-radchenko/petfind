import React from "react";
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
  return (
    <Router>

      {/* A <Switch> looks through its children <Route>s and
      renders the first one that matches the current URL. */}
      <main className="main">
        <Switch>
          <Route path="/contact-us">
            Contact us Page coming soon
          </Route>
          <Route path="/terms-and-conditions">
            Terms and conditions page coming soon
          </Route>
          <Route path="/about">
            About page coming soon
          </Route>
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
      </main>
    </Router>
  );
}

