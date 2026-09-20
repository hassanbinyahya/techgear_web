import React, { createContext, useState, useEffect } from 'react';
import API from '../api/axios';

export const ADMIN_EMAIL = 'Admin321@gmail.com';
export const ADMIN_PASSWORD = '13579@%&Hb';

export const AuthContext = createContext();

const isAdminUser = (account) => {
    if (!account) return false;
    return account.role === 'admin' || account.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('techgear_user');
        if (savedUser) setUser(JSON.parse(savedUser));
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const trimmedEmail = (email || '').trim();

        if (trimmedEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
            const adminUser = { _id: 'admin', name: 'Admin', email: ADMIN_EMAIL, role: 'admin' };
            setUser(adminUser);
            localStorage.setItem('techgear_user', JSON.stringify(adminUser));
            localStorage.setItem('techgear_token', 'admin-auth-token');
            return { success: true, message: 'Admin login successful', user: adminUser };
        }

        try {
            const response = await API.post('/login', { email: trimmedEmail, password });
            const { user: authUser, token } = response.data;
            setUser(authUser);
            localStorage.setItem('techgear_user', JSON.stringify(authUser));
            localStorage.setItem('techgear_token', token);
            return { success: true, message: 'Login successful', user: authUser };
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
        <AuthContext.Provider value={{ user, login, register, logout, loading, isAdmin: isAdminUser(user) }}>
            {children}
        </AuthContext.Provider>
    );
};