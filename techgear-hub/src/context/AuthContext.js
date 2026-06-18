import React, { createContext, useState, useEffect } from 'react';
import API from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('techgear_user');
        if (savedUser) setUser(JSON.parse(savedUser));
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await API.post('/login', { email, password });
            const { user: authUser, token } = response.data;
            setUser(authUser);
            localStorage.setItem('techgear_user', JSON.stringify(authUser));
            localStorage.setItem('techgear_token', token);
            return { success: true, message: 'Login successful' };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await API.post('/register', { name, email, password });
            return { success: response.data.success, message: 'Registration successful' };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('techgear_user');
        localStorage.removeItem('techgear_token');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};