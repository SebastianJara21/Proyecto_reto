import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function AsistenciaForm() {
    const [asistencias, setAsistencias] = useState([]);
    const [matriculas, setMatriculas] = useState([]);
    const [asistencia, setAsistencia] = useState({
        fecha: new Date().toISOString().split('T')[0],
        presente: true,
        matricula: { id: "" }
    });
    const [editando, setEditando] = useState(false);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [filtroFecha, setFiltroFecha] = useState("");
    const [filtroMatricula, setFiltroMatricula] = useState("");

    useEffect(() => {
        cargarAsistencias();
        cargarMatriculas();
    }, []);

    const cargarAsistencias = async () => {
        try {
            const response = await api.get("/asistencias");
            setAsistencias(response.data);
        } catch (error) {
            console.error("Error al cargar asistencias:", error);
        }
    };

    const cargarMatriculas = async () => {
        try {
            const response = await api.get("/matriculas");
            setMatriculas(response.data);
        } catch (error) {
            console.error("Error al cargar matrículas:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editando) {
                await api.put(`/asistencias/${asistencia.id}`, asistencia);
                alert("Asistencia actualizada correctamente");
            } else {
                await api.post("/asistencias", asistencia);
                alert("Asistencia registrada correctamente");
            }
            resetFormulario();
            cargarAsistencias();
        } catch (error) {
            console.error("Error al guardar asistencia:", error);
            alert("Error al guardar la asistencia");
        }
    };

    const editarAsistencia = (a) => {
        setAsistencia({
            ...a,
            matricula: { id: a.matricula.id }
        });
        setEditando(true);
        setMostrarFormulario(true);
    };

    const eliminarAsistencia = async (id) => {
        if (window.confirm("¿Está seguro de eliminar este registro de asistencia?")) {
            try {
                await api.delete(`/asistencias/${id}`);
                alert("Asistencia eliminada correctamente");
                cargarAsistencias();
            } catch (error) {
                console.error("Error al eliminar asistencia:", error);
                alert("Error al eliminar la asistencia");
            }
        }
    };

    const resetFormulario = () => {
        setAsistencia({
            fecha: new Date().toISOString().split('T')[0],
            presente: true,
            matricula: { id: "" }
        });
        setEditando(false);
        setMostrarFormulario(false);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === "matriculaId") {
            setAsistencia(prev => ({
                ...prev,
                matricula: { id: value }
            }));
        } else if (type === "checkbox") {
            setAsistencia(prev => ({
                ...prev,
                [name]: checked
            }));
        } else {
            setAsistencia(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Filtrar asistencias
    const asistenciasFiltradas = asistencias.filter(a => {
        const cumpleFecha = !filtroFecha || a.fecha === filtroFecha;
        const cumpleMatricula = !filtroMatricula || 
            (a.matricula?.estudiante?.nombre + " " + a.matricula?.estudiante?.apellido)
                .toLowerCase().includes(filtroMatricula.toLowerCase()) ||
            a.matricula?.curso?.nombre.toLowerCase().includes(filtroMatricula.toLowerCase());
        return cumpleFecha && cumpleMatricula;
    });

    const registrarAsistenciaMasiva = async (fecha, presente) => {
        if (window.confirm(`¿Marcar todos los estudiantes como ${presente ? 'presentes' : 'ausentes'} para el ${fecha}?`)) {
            try {
                const promesas = matriculas.map(matricula => 
                    api.post("/asistencias", {
                        fecha: fecha,
                        presente: presente,
                        matricula: { id: matricula.id }
                    })
                );
                await Promise.all(promesas);
                alert("Asistencia masiva registrada correctamente");
                cargarAsistencias();
            } catch (error) {
                console.error("Error al registrar asistencia masiva:", error);
                alert("Error al registrar la asistencia masiva");
            }
        }
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Control de Asistencias</h1>
                <p>Registra y consulta la asistencia diaria de estudiantes</p>
                <nav>
                    <Link to="/">Inicio</Link>
                    <Link to="/estudiantes">Estudiantes</Link>
                    <Link to="/docentes">Docentes</Link>
                    <Link to="/matriculas">Matrículas</Link>
                    <Link to="/asistencias" className="active">Asistencias</Link>
                    <Link to="/calificaciones">Calificaciones</Link>
                </nav>
            </header>

            <main className="dashboard-main">
                <div className="form-section">
                    <div className="form-header">
                        <h2>Registro de Asistencias</h2>
                        <div className="form-actions">
                            <button 
                                className="btn-primary"
                                onClick={() => setMostrarFormulario(!mostrarFormulario)}
                            >
                                {mostrarFormulario ? "Cancelar" : "Nueva Asistencia"}
                            </button>
                            <button 
                                className="btn-success"
                                onClick={() => registrarAsistenciaMasiva(new Date().toISOString().split('T')[0], true)}
                            >
                                Marcar Todos Presentes Hoy
                            </button>
                        </div>
                    </div>

                    {mostrarFormulario && (
                        <form onSubmit={handleSubmit} className="form-container">
                            <h3>{editando ? "Editar Asistencia" : "Registrar Nueva Asistencia"}</h3>
                            
                            <div className="form-group">
                                <label htmlFor="fecha">Fecha:</label>
                                <input
                                    type="date"
                                    id="fecha"
                                    name="fecha"
                                    value={asistencia.fecha}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="matriculaId">Seleccionar Estudiante:</label>
                                <select
                                    id="matriculaId"
                                    name="matriculaId"
                                    value={asistencia.matricula.id}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Seleccione un estudiante</option>
                                    {matriculas.map(matricula => (
                                        <option key={matricula.id} value={matricula.id}>
                                            {matricula.estudiante?.nombre} {matricula.estudiante?.apellido} 
                                            ({matricula.estudiante?.identificacion}) - {matricula.curso?.nombre}
                                        </option>
                                    ))}
                                </select>
                                <small className="form-help">
                                    Estudiantes matriculados en cursos activos
                                </small>
                            </div>

                            <div className="form-group checkbox-group">
                                <label htmlFor="presente">
                                    <input
                                        type="checkbox"
                                        id="presente"
                                        name="presente"
                                        checked={asistencia.presente}
                                        onChange={handleInputChange}
                                    />
                                    Presente
                                </label>
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

                    {/* Filtros */}
                    <div className="filtros-container">
                        <h3>Filtros</h3>
                        <div className="filtros-grupo">
                            <div className="form-group">
                                <label htmlFor="filtroFecha">Filtrar por fecha:</label>
                                <input
                                    type="date"
                                    id="filtroFecha"
                                    value={filtroFecha}
                                    onChange={(e) => setFiltroFecha(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="filtroMatricula">Buscar estudiante/curso:</label>
                                <input
                                    type="text"
                                    id="filtroMatricula"
                                    placeholder="Nombre del estudiante o curso"
                                    value={filtroMatricula}
                                    onChange={(e) => setFiltroMatricula(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-actions" style={{ marginTop: '15px' }}>
                            <button 
                                className="btn-secondary"
                                onClick={() => {
                                    setFiltroFecha("");
                                    setFiltroMatricula("");
                                }}
                            >
                                Limpiar Filtros
                            </button>
                        </div>
                    </div>

                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Fecha</th>
                                    <th>Estudiante</th>
                                    <th>Curso</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {asistenciasFiltradas.map(a => (
                                    <tr key={a.id}>
                                        <td>{a.id}</td>
                                        <td>{a.fecha}</td>
                                        <td>{a.matricula?.estudiante?.nombre} {a.matricula?.estudiante?.apellido}</td>
                                        <td>{a.matricula?.curso?.nombre}</td>
                                        <td>
                                            <span className={`estado ${a.presente ? 'presente' : 'ausente'}`}>
                                                {a.presente ? '✓ Presente' : '✗ Ausente'}
                                            </span>
                                        </td>
                                        <td>
                                            <button 
                                                onClick={() => editarAsistencia(a)}
                                                className="btn-edit"
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                onClick={() => eliminarAsistencia(a.id)}
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
