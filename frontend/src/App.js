import React from "react";
import './Components/Layout/Dashboard.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import EstudianteForm from "./Components/estudiantes/EstudianteForm";
import DocenteForm from "./Components/docentes/DocenteForm";
import CursoForm from "./Components/cursos/CursoForm";
import MatriculaForm from "./Components/matriculas/MatriculaForm";
import AsistenciaForm from "./Components/asistencias/AsistenciaForm";
import CalificacionForm from "./Components/calificaciones/CalificacionForm";
import BusquedaInteligente from "./Components/busqueda/BusquedaInteligente";
import Dashboard from "./Components/Layout/Dashboard";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/estudiantes" element={<EstudianteForm />} />
                <Route path="/docentes" element={<DocenteForm/>} />
                <Route path="/cursos" element={<CursoForm/>} />
                <Route path="/matriculas" element={<MatriculaForm/>} />
                <Route path="/asistencias" element={<AsistenciaForm/>} />
                <Route path="/calificaciones" element={<CalificacionForm/>} />
                <Route path="/busqueda" element={<BusquedaInteligente/>} />
            </Routes>
        </Router>
    );
}
