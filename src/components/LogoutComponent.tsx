import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutComponent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Function to delete the authentication cookie
    const deleteAuthCookie = () => {
      document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    };

    deleteAuthCookie();
    navigate('/'); // Redirect to the home or login page
  }, [navigate]);

  return null; // This component does not render anything
};

export default LogoutComponent;
