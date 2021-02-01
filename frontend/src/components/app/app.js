import React, { useEffect, useReducer, createContext, useContext } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { usePosition } from "use-position";

import { fetchLocation } from "../../services";

import Header from "../header";
import Home from "../home";
import Login from "../login";
import Dasboard from "../dashboard";
import SetPassword from "../set-password";
import RegisterTagForm from "../register-tag-form";
import Footer from "../footer";
import PrivateRoute from "../hoc";
import ForgotPassword from "../forgot-password";
import ResetPassword from "../reset-password";
import ConfirmationPending from "../confirmation-pending";

import "./app.css";

const AppContext = createContext(null);

export function useAppContext() {
  return useContext(AppContext);
}

const initialState = {
  location: null,
  registerTagId: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "UPDATE_LOCATION":
      return {
        ...state,
        location: action.payload,
      };
    case "REGISTER_TAG_ID":
      return {
        ...state,
        registerTagId: action.payload,
      };
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { latitude, longitude, accuracy } = usePosition();

  useEffect(() => {
    fetchLocation().then((res) => {
      dispatch({
        type: "UPDATE_LOCATION",
        payload: res,
      });
    });
  }, []);

  useEffect(() => {
    if (latitude || longitude) {
      const location = { ...state.location };
      location.lat = latitude;
      location.lon = longitude;
      dispatch({
        type: "UPDATE_LOCATION",
        payload: location
      });
    }
  }, [latitude, longitude]);

  return (
    <AppContext.Provider value={[state, dispatch]}>
      <Router basename='/'>
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
          <Route path='/activate_your_account'>
            <ConfirmationPending />
          </Route>
          <Route path='/auth/set_password/:token'>
            <SetPassword />
          </Route>
          <PrivateRoute path='/dashboard' component={Dasboard} />
          <Route path='/auth/forgot_password'>
            <ForgotPassword />
          </Route>
          <Route path='/auth/reset_password/:token'>
            <ResetPassword />
          </Route>
          <Route path='/'>
            <Header />
            <Home />
            <Footer />
          </Route>
        </Switch>
      </Router>
    </AppContext.Provider>
  );
}
