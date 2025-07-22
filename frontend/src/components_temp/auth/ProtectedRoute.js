import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const isAuthenticated = authService.isAuthenticated();
    const currentUser = authService.getCurrentUser();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser?.role)) {
        return (
            <div className="access-denied">
                <h3>Acceso denegado</h3>
                <p>No tienes permisos para acceder a este contenido.</p>
                <p>Tu rol actual: {currentUser?.role}</p>
                <p>Roles permitidos: {allowedRoles.join(', ')}</p>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
