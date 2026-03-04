import { createContext, useContext, useState, useEffect } from 'react';
import { getMyProfile } from '../api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('ridebuddy_token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    const { data } = await getMyProfile();
                    setUser(data);
                } catch {
                    localStorage.removeItem('ridebuddy_token');
                    setToken(null);
                }
            }
            setLoading(false);
        };
        loadUser();
    }, [token]);

    const loginUser = (token, userData) => {
        localStorage.setItem('ridebuddy_token', token);
        setToken(token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('ridebuddy_token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, loginUser, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
