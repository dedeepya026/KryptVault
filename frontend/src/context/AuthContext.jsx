import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { deriveKey } from '../services/crypto';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [encryptionKey, setEncryptionKey] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (savedUser && token) {
            setUser(JSON.parse(savedUser));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setLoading(false);
    }, []);

    const signup = async (email, password, salt) => {
        const response = await axios.post('http://localhost:5001/api/auth/signup', { email, password, salt });
        const { token, user: userData } = response.data;

        // For signup, we have the password handy to derive the key
        const key = deriveKey(password, salt);
        setEncryptionKey(key);

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return response.data;
    };

    const login = async (email, password) => {
        const response = await axios.post('http://localhost:5001/api/auth/login', { email, password });
        const { token, user: userData } = response.data;

        // Derive key using stored salt
        const key = deriveKey(password, userData.salt);
        setEncryptionKey(key);

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setEncryptionKey(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, encryptionKey, loading, signup, login, logout, setEncryptionKey }}>
            {children}
        </AuthContext.Provider>
    );
};
