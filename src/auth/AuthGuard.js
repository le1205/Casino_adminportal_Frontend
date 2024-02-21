import PropTypes from 'prop-types';
import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// components
import LoadingScreen from '../components/loading-screen';
//
import Login from '../pages/auth/LoginPage';
import { useAuthContext } from './useAuthContext';
// utils
import {parseJson } from './utils';

// ----------------------------------------------------------------------

AuthGuard.propTypes = {
  children: PropTypes.node,
};

export default function AuthGuard({ children }) {
  // const { isAuthenticated, isInitialized } = useAuthContext();

  // const { pathname } = useLocation();

  // const [requestedLocation, setRequestedLocation] = useState(null);

  

  // if (!isInitialized) {
  //   return <LoadingScreen />;
  // }

  // if (!isAuthenticated) {
  //   if (pathname !== requestedLocation) {
  //     setRequestedLocation(pathname);
  //   }
  //   return <Login />;
  // }

  // if (requestedLocation && pathname !== requestedLocation) {
  //   setRequestedLocation(null);
  //   return <Navigate to={requestedLocation} />;
  // }


  const token =localStorage.getItem('accessToken');
  const user = parseJson(localStorage.getItem('user') || "");
  
  if (token === null || token === "" || user._id === undefined || user._id === "") {
    return <Login />;
  }

  return <> {children} </>;
}
