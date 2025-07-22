import api from './api';

export const authService = {
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            const { token, username, role } = response.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({ username, role }));
            
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Error al iniciar sesión';
        }
    },

    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            const { token, username, role } = response.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({ username, role }));
            
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Error al registrarse';
        }
    },

    loginAsGuest: async () => {
        try {
            const response = await api.post('/auth/guest');
            const { token, username, role } = response.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({ username, role }));
            
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Error al iniciar sesión como invitado';
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        return !!token;
    },

    getToken: () => {
        return localStorage.getItem('token');
    }
};
