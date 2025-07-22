import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function MatriculaForm() {
    const [matriculas, setMatriculas] = useState([]);
    const [estudiantes, setEstudiantes] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [matricula, setMatricula] = useState({
        anio: new Date().getFullYear(),
        estudiante: { id: "" },
        curso: { id: "" }
    });
    const [editando, setEditando] = useState(false);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    useEffect(() => {
        cargarMatriculas();
        cargarEstudiantes();
        cargarCursos();
    }, []);

    const cargarMatriculas = async () => {
        try {
            const response = await api.get("/matriculas");
            setMatriculas(response.data);
        } catch (error) {
            console.error("Error al cargar matrículas:", error);
        }
    };

    const cargarEstudiantes = async () => {
        try {
            const response = await api.get("/estudiantes");
            setEstudiantes(response.data);
        } catch (error) {
            console.error("Error al cargar estudiantes:", error);
        }
    };

    const cargarCursos = async () => {
        try {
            const response = await api.get("/cursos");
            setCursos(response.data);
        } catch (error) {
            console.error("Error al cargar cursos:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editando) {
                await api.put(`/matriculas/${matricula.id}`, matricula);
                alert("Matrícula actualizada correctamente");
            } else {
                await api.post("/matriculas", matricula);
                alert("Matrícula registrada correctamente");
            }
            resetFormulario();
            cargarMatriculas();
        } catch (error) {
            console.error("Error al guardar matrícula:", error);
            alert("Error al guardar la matrícula");
        }
    };

    const editarMatricula = (m) => {
        setMatricula({
            ...m,
            estudiante: { id: m.estudiante.id },
            curso: { id: m.curso.id }
        });
        setEditando(true);
        setMostrarFormulario(true);
    };

    const eliminarMatricula = async (id) => {
        if (window.confirm("¿Está seguro de eliminar esta matrícula?")) {
            try {
                await api.delete(`/matriculas/${id}`);
                alert("Matrícula eliminada correctamente");
                cargarMatriculas();
            } catch (error) {
                console.error("Error al eliminar matrícula:", error);
                alert("Error al eliminar la matrícula");
            }
        }
    };

    const resetFormulario = () => {
        setMatricula({
            anio: new Date().getFullYear(),
            estudiante: { id: "" },
            curso: { id: "" }
        });
        setEditando(false);
        setMostrarFormulario(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "estudianteId") {
            setMatricula(prev => ({
                ...prev,
                estudiante: { id: value }
            }));
        } else if (name === "cursoId") {
            setMatricula(prev => ({
                ...prev,
                curso: { id: value }
            }));
        } else {
            setMatricula(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Gestión de Matrículas</h1>
                <p>Administra las matrículas de estudiantes en cursos</p>
                <nav>
                    <Link to="/">Inicio</Link>
                    <Link to="/estudiantes">Estudiantes</Link>
                    <Link to="/docentes">Docentes</Link>
                    <Link to="/matriculas" className="active">Matrículas</Link>
                    <Link to="/asistencias">Asistencias</Link>
                    <Link to="/calificaciones">Calificaciones</Link>
                </nav>
            </header>

            <main className="dashboard-main">
                <div className="form-section">
                    <div className="form-header">
                        <h2>Matrículas Registradas</h2>
                        <button 
                            className="btn-primary"
                            onClick={() => setMostrarFormulario(!mostrarFormulario)}
                        >
                            {mostrarFormulario ? "Cancelar" : "Nueva Matrícula"}
                        </button>
                    </div>

                    {mostrarFormulario && (
                        <form onSubmit={handleSubmit} className="form-container">
                            <h3>{editando ? "Editar Matrícula" : "Registrar Nueva Matrícula"}</h3>
                            
                            <div className="form-group">
                                <label htmlFor="anio">Año:</label>
                                <input
                                    type="number"
                                    id="anio"
                                    name="anio"
                                    value={matricula.anio}
                                    onChange={handleInputChange}
                                    required
                                    min="2020"
                                    max="2030"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="estudianteId">Estudiante:</label>
                                <select
                                    id="estudianteId"
                                    name="estudianteId"
                                    value={matricula.estudiante.id}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Seleccione un estudiante</option>
                                    {estudiantes.map(estudiante => (
                                        <option key={estudiante.id} value={estudiante.id}>
                                            {estudiante.nombre} {estudiante.apellido} - {estudiante.correo}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="cursoId">Curso:</label>
                                <select
                                    id="cursoId"
                                    name="cursoId"
                                    value={matricula.curso.id}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Seleccione un curso</option>
                                    {cursos.map(curso => (
                                        <option key={curso.id} value={curso.id}>
                                            {curso.nombre} - {curso.descripcion}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn-primary">
                                    {editando ? "Actualizar" : "Registrar"}
                                </button>
                                <button type="button" onClick={resetFormulario} className="btn-secondary">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Año</th>
                                    <th>Estudiante</th>
                                    <th>Curso</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {matriculas.map(m => (
                                    <tr key={m.id}>
                                        <td>{m.id}</td>
                                        <td>{m.anio}</td>
                                        <td>{m.estudiante?.nombre} {m.estudiante?.apellido}</td>
                                        <td>{m.curso?.nombre}</td>
                                        <td>
                                            <button 
                                                onClick={() => editarMatricula(m)}
                                                className="btn-edit"
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                onClick={() => eliminarMatricula(m.id)}
                                                className="btn-delete"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
