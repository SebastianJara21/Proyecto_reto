import React, { useState, useEffect } from "react";
import './components_temp/layout/Dashboard.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import EstudianteForm from "./components_temp/estudiantes/EstudianteForm";
import DocenteForm from "./components_temp/docentes/DocenteForm";
import CursoForm from "./components_temp/cursos/CursoForm";
import MatriculaForm from "./components_temp/matriculas/MatriculaForm";
import AsistenciaForm from "./components_temp/asistencias/AsistenciaForm";
import CalificacionForm from "./components_temp/calificaciones/CalificacionForm";
import BusquedaInteligente from "./components_temp/busqueda/BusquedaInteligente";
import Dashboard from "./components_temp/layout/Dashboard";
import Login from "./components_temp/auth/Login";
import ProtectedRoute from "./components_temp/auth/ProtectedRoute";
import AdminSetup from "./components_temp/admin/AdminSetup";
import { authService } from "./components_temp/services/authService";

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verificar si el usuario está autenticado al cargar la app
        setIsAuthenticated(authService.isAuthenticated());
        setLoading(false);
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    if (loading) {
        return <div className="loading">Cargando...</div>;
    }

    return (
        <Router>
            <Routes>
                <Route 
                    path="/login" 
                    element={
                        isAuthenticated ? 
                        <Navigate to="/" replace /> : 
                        <Login onLogin={handleLogin} />
                    } 
                />
                
                <Route 
                    path="/" 
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } 
                />
                
                <Route 
                    path="/estudiantes" 
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'DOCENTE', 'INVITADO']}>
                            <EstudianteForm />
                        </ProtectedRoute>
                    } 
                />
                
                <Route 
                    path="/docentes" 
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'DOCENTE']}>
                            <DocenteForm/>
                        </ProtectedRoute>
                    } 
                />
                
                <Route 
                    path="/cursos" 
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'DOCENTE', 'INVITADO']}>
                            <CursoForm/>
                        </ProtectedRoute>
                    } 
                />
                
                <Route 
                    path="/matriculas" 
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'DOCENTE']}>
                            <MatriculaForm/>
                        </ProtectedRoute>
                    } 
                />
                
                <Route 
                    path="/asistencias" 
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'DOCENTE']}>
                            <AsistenciaForm/>
                        </ProtectedRoute>
                    } 
                />
                
                <Route 
                    path="/calificaciones" 
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'DOCENTE']}>
                            <CalificacionForm/>
                        </ProtectedRoute>
                    } 
                />
                
                <Route 
                    path="/setup" 
                    element={<AdminSetup />} 
                />
                
                <Route 
                    path="/busqueda" 
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'DOCENTE', 'INVITADO']}>
                            <BusquedaInteligente/>
                        </ProtectedRoute>
                    } 
                />
                
                {/* Redirigir rutas no autenticadas al login */}
                <Route 
                    path="*" 
                    element={
                        !isAuthenticated ? 
                        <Navigate to="/login" replace /> : 
                        <Navigate to="/" replace />
                    } 
                />
            </Routes>
        </Router>
    );
}
