import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const IsAdmin = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    useEffect(() => {
        const checkToken = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth-api/check-admin`, {
                    withCredentials: true,
                });

                const { status } = response.data;
                if (status) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (err) {
                console.error(err);
                setIsLoggedIn(false);
            }
        };

        checkToken();
    }, []);

    if (isLoggedIn === null) {
        return;
    }

    if (isLoggedIn) {
        return <Outlet />;
    }

    return <Navigate to="/" replace />;
};

export default IsAdmin;