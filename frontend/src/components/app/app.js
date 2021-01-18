import React, { useEffect, useReducer, createContext, useContext } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { fetchLocation } from "../../services";

import Header from "../header";
import Home from "../home";
import Login from "../login";
import Dasboard from "../dashboard";
import SetPassword from "../set-password";
import RegisterTagForm from "../register-tag-form";
import Footer from "../footer";
import DashboardTable from "../dashboard-table";
import PrivateRoute from "../hoc";

import "./app.css";

const AppContext = createContext(null);

export function useAppContext() {
  return useContext(AppContext);
}

const initialState = {
  location: null,
  foundOwnerModal: false,
  contactOwnerModal: false,
  editTagModal: false,
  deleteTagModal: false,
  addTagModal: false
};

function reducer(state, action) {
  switch (action.type) {
    case "UPDATE_LOCATION":
      return {
        ...state,
        location: action.payload,
      };
    case "TOGGLE_FOUND_OWNER":
      return {
        ...state,
        foundOwnerModal: action.payload,
      }
    case "TOGGLE_CONTACT_OWNER":
      return {
        ...state,
        contactOwnerModal: action.payload,
      }
    case "TOGGLE_EDIT_TAG":
      return {
        ...state,
        editTagModal: action.payload,
      }
    case "TOGGLE_DELETE_TAG":
      return {
        ...state,
        deleteTagModal: action.payload,
      }
    case "TOGGLE_ADD_TAG":
      return {
        ...state,
        addTagModal: action.payload,
      }
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchLocation().then((res) => {
      console.log("Location response:", res);
      dispatch({
        type: "UPDATE_LOCATION",
        payload: res,
      });
    });
  }, []);

  return (
    <AppContext.Provider value={[state, dispatch]}>
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
          <Route path='/dashboard-table'>
            <DashboardTable />
          </Route>
          <PrivateRoute path='/dashboard' component={Dasboard} />
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
