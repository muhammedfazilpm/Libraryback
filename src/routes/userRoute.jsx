// components/AdminRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api';

const AdminRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem('userToken');

        const response = await axios.get(`${api}/verify-user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success && response.data.user.role === 'user') {
          setIsAuthorized(true);
        }

      } catch (error) {
        console.error('Auth check failed', error);
      } finally {
        setIsLoading(false);
      }
    };

    verifyUser();
  }, []);

  if (isLoading) return <div>Loading...</div>; // or a spinner

  if (!isAuthorized) return <Navigate to="/" replace />;

  return children;
};

export default AdminRoute;
