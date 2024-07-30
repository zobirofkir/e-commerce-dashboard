import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectRoutes = ({ children }) => {
  const token = Cookies.get('auth_token');

  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectRoutes;
