import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function CalificacionForm() {
    const [calificaciones, setCalificaciones] = useState([]);
    const [matriculas, setMatriculas] = useState([]);
    const [calificacion, setCalificacion] = useState({
        tipo: "",
        valor: "",
        fecha: new Date().toISOString().split('T')[0],
        matricula: { id: "" }
    });
    const [editando, setEditando] = useState(false);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [filtroTipo, setFiltroTipo] = useState("");
    const [filtroMatricula, setFiltroMatricula] = useState("");

    const tiposCalificacion = [
        "Examen Parcial",
        "Examen Final",
        "Tarea",
        "Proyecto",
        "Participación",
        "Quiz",
        "Laboratorio",
        "Presentación"
    ];

    useEffect(() => {
        cargarCalificaciones();
        cargarMatriculas();
    }, []);

    const cargarCalificaciones = async () => {
        try {
            const response = await api.get("/calificaciones");
            setCalificaciones(response.data);
        } catch (error) {
            console.error("Error al cargar calificaciones:", error);
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
        
        // Validar que la calificación esté entre 0 y 100
        if (calificacion.valor < 0 || calificacion.valor > 100) {
            alert("La calificación debe estar entre 0 y 100");
            return;
        }

        try {
            if (editando) {
                await api.put(`/calificaciones/${calificacion.id}`, calificacion);
                alert("Calificación actualizada correctamente");
            } else {
                await api.post("/calificaciones", calificacion);
                alert("Calificación registrada correctamente");
            }
            resetFormulario();
            cargarCalificaciones();
        } catch (error) {
            console.error("Error al guardar calificación:", error);
            alert("Error al guardar la calificación");
        }
    };

    const editarCalificacion = (c) => {
        setCalificacion({
            ...c,
            matricula: { id: c.matricula.id }
        });
        setEditando(true);
        setMostrarFormulario(true);
    };

    const eliminarCalificacion = async (id) => {
        if (window.confirm("¿Está seguro de eliminar esta calificación?")) {
            try {
                await api.delete(`/calificaciones/${id}`);
                alert("Calificación eliminada correctamente");
                cargarCalificaciones();
            } catch (error) {
                console.error("Error al eliminar calificación:", error);
                alert("Error al eliminar la calificación");
            }
        }
    };

    const resetFormulario = () => {
        setCalificacion({
            tipo: "",
            valor: "",
            fecha: new Date().toISOString().split('T')[0],
            matricula: { id: "" }
        });
        setEditando(false);
        setMostrarFormulario(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "matriculaId") {
            setCalificacion(prev => ({
                ...prev,
                matricula: { id: value }
            }));
        } else {
            setCalificacion(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Filtrar calificaciones
    const calificacionesFiltradas = calificaciones.filter(c => {
        const cumpleTipo = !filtroTipo || c.tipo.toLowerCase().includes(filtroTipo.toLowerCase());
        const cumpleMatricula = !filtroMatricula || 
            (c.matricula?.estudiante?.nombre + " " + c.matricula?.estudiante?.apellido)
                .toLowerCase().includes(filtroMatricula.toLowerCase()) ||
            c.matricula?.curso?.nombre.toLowerCase().includes(filtroMatricula.toLowerCase());
        return cumpleTipo && cumpleMatricula;
    });

    // Calcular estadísticas
    const calcularEstadisticas = () => {
        if (calificacionesFiltradas.length === 0) return null;
        
        const valores = calificacionesFiltradas.map(c => parseFloat(c.valor));
        const promedio = valores.reduce((a, b) => a + b, 0) / valores.length;
        const maximo = Math.max(...valores);
        const minimo = Math.min(...valores);
        
        return { promedio: promedio.toFixed(2), maximo, minimo };
    };

    const estadisticas = calcularEstadisticas();

    const obtenerColorNota = (valor) => {
        if (valor >= 90) return "excelente";
        if (valor >= 80) return "bueno";
        if (valor >= 70) return "regular";
        return "deficiente";
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Gestión de Calificaciones</h1>
                <p>Registra y consulta las notas y evaluaciones de estudiantes</p>
                <nav>
                    <Link to="/">Inicio</Link>
                    <Link to="/estudiantes">Estudiantes</Link>
                    <Link to="/docentes">Docentes</Link>
                    <Link to="/matriculas">Matrículas</Link>
                    <Link to="/asistencias">Asistencias</Link>
                    <Link to="/calificaciones" className="active">Calificaciones</Link>
                </nav>
            </header>

            <main className="dashboard-main">
                <div className="form-section">
                    <div className="form-header">
                        <h2>Registro de Calificaciones</h2>
                        <button 
                            className="btn-primary"
                            onClick={() => setMostrarFormulario(!mostrarFormulario)}
                        >
                            {mostrarFormulario ? "Cancelar" : "Nueva Calificación"}
                        </button>
                    </div>

                    {mostrarFormulario && (
                        <form onSubmit={handleSubmit} className="form-container">
                            <h3>{editando ? "Editar Calificación" : "Registrar Nueva Calificación"}</h3>
                            
                            <div className="form-group">
                                <label htmlFor="tipo">Tipo de Evaluación:</label>
                                <select
                                    id="tipo"
                                    name="tipo"
                                    value={calificacion.tipo}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Seleccione el tipo</option>
                                    {tiposCalificacion.map(tipo => (
                                        <option key={tipo} value={tipo}>
                                            {tipo}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="valor">Calificación (0-100):</label>
                                <input
                                    type="number"
                                    id="valor"
                                    name="valor"
                                    value={calificacion.valor}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    placeholder="Ej: 85.5"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="fecha">Fecha:</label>
                                <input
                                    type="date"
                                    id="fecha"
                                    name="fecha"
                                    value={calificacion.fecha}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="matriculaId">Estudiante/Curso:</label>
                                <select
                                    id="matriculaId"
                                    name="matriculaId"
                                    value={calificacion.matricula.id}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Seleccione una matrícula</option>
                                    {matriculas.map(matricula => (
                                        <option key={matricula.id} value={matricula.id}>
                                            {matricula.estudiante?.nombre} {matricula.estudiante?.apellido} - {matricula.curso?.nombre}
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

                    {/* Filtros */}
                    <div className="filtros-container">
                        <h3>Filtros y Estadísticas</h3>
                        <div className="filtros-grupo" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                            <div className="form-group" style={{ flex: '1', minWidth: '200px' }}>
                                <label htmlFor="filtroTipo">Filtrar por tipo:</label>
                                <select
                                    id="filtroTipo"
                                    value={filtroTipo}
                                    onChange={(e) => setFiltroTipo(e.target.value)}
                                >
                                    <option value="">Todos los tipos</option>
                                    {tiposCalificacion.map(tipo => (
                                        <option key={tipo} value={tipo}>
                                            {tipo}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group" style={{ flex: '1', minWidth: '200px' }}>
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
                                    setFiltroTipo("");
                                    setFiltroMatricula("");
                                }}
                            >
                                Limpiar Filtros
                            </button>
                        </div>

                        {estadisticas && (
                            <div className="estadisticas">
                                <h4>Estadísticas de Calificaciones Filtradas:</h4>
                                <div className="estadisticas-grupo">
                                    <div className="estadistica">
                                        <span>Promedio:</span>
                                        <strong>{estadisticas.promedio}</strong>
                                    </div>
                                    <div className="estadistica">
                                        <span>Nota Máxima:</span>
                                        <strong>{estadisticas.maximo}</strong>
                                    </div>
                                    <div className="estadistica">
                                        <span>Nota Mínima:</span>
                                        <strong>{estadisticas.minimo}</strong>
                                    </div>
                                    <div className="estadistica">
                                        <span>Total Registros:</span>
                                        <strong>{calificacionesFiltradas.length}</strong>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tipo</th>
                                    <th>Calificación</th>
                                    <th>Fecha</th>
                                    <th>Estudiante</th>
                                    <th>Curso</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {calificacionesFiltradas.map(c => (
                                    <tr key={c.id}>
                                        <td>{c.id}</td>
                                        <td>{c.tipo}</td>
                                        <td>
                                            <span className={`calificacion ${obtenerColorNota(c.valor)}`}>
                                                {c.valor}
                                            </span>
                                        </td>
                                        <td>{c.fecha}</td>
                                        <td>{c.matricula?.estudiante?.nombre} {c.matricula?.estudiante?.apellido}</td>
                                        <td>{c.matricula?.curso?.nombre}</td>
                                        <td>
                                            <button 
                                                onClick={() => editarCalificacion(c)}
                                                className="btn-edit"
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                onClick={() => eliminarCalificacion(c.id)}
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
