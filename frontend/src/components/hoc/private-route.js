import React from 'react'
import {Route, Redirect} from 'react-router-dom';
import {useAuth} from '../../services';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [logged] = useAuth();

  return <Route {...rest} render={(props) => (logged ? <Component {...props} /> : <Redirect to='/login' />)} />;
};

export default PrivateRoute;
