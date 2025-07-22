import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function DocenteForm() {
    const [docentes, setDocentes] = useState([]);
    const [docente, setDocente] = useState({
        identificacion: "",
        nombre: "",
        email: "",
        especialidad: ""
    });
    const [editando, setEditando] = useState(false);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [filtroNombre, setFiltroNombre] = useState("");

    useEffect(() => {
        cargarDocentes();
    }, []);

    const cargarDocentes = async () => {
        try {
            const response = await api.get("/docentes");
            setDocentes(response.data);
        } catch (error) {
            console.error("Error al cargar docentes:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editando) {
                await api.put(`/docentes/${docente.id}`, docente);
                alert("Docente actualizado correctamente");
            } else {
                await api.post("/docentes", docente);
                alert("Docente registrado correctamente");
            }
            resetFormulario();
            cargarDocentes();
        } catch (error) {
            console.error("Error al guardar docente:", error);
            alert("Error al guardar el docente");
        }
    };

    const editarDocente = (d) => {
        setDocente(d);
        setEditando(true);
        setMostrarFormulario(true);
    };

    const eliminarDocente = async (id) => {
        if (window.confirm("¿Está seguro de eliminar este docente?")) {
            try {
                await api.delete(`/docentes/${id}`);
                alert("Docente eliminado correctamente");
                cargarDocentes();
            } catch (error) {
                console.error("Error al eliminar docente:", error);
                alert("Error al eliminar el docente");
            }
        }
    };

    const resetFormulario = () => {
        setDocente({
            identificacion: "",
            nombre: "",
            email: "",
            especialidad: ""
        });
        setEditando(false);
        setMostrarFormulario(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDocente(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const docentesFiltrados = docentes.filter(d => {
        const cumpleNombre = !filtroNombre || 
            d.nombre.toLowerCase().includes(filtroNombre.toLowerCase()) ||
            d.identificacion.includes(filtroNombre) ||
            d.email.toLowerCase().includes(filtroNombre.toLowerCase());
        return cumpleNombre;
    });

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Gestión de Docentes</h1>
                <p>Administra los docentes del sistema educativo</p>
                <nav>
                    <Link to="/">Inicio</Link>
                    <Link to="/estudiantes">Estudiantes</Link>
                    <Link to="/docentes" className="active">Docentes</Link>
                    <Link to="/matriculas">Matrículas</Link>
                    <Link to="/asistencias">Asistencias</Link>
                    <Link to="/calificaciones">Calificaciones</Link>
                </nav>
            </header>

            <main className="dashboard-main">
                <div className="form-section">
                    <div className="form-header">
                        <h2>Docentes Registrados</h2>
                        <div style={{display: 'flex', gap: '10px'}}>
                            <button 
                                className="btn-primary"
                                onClick={() => setMostrarFormulario(!mostrarFormulario)}
                            >
                                {mostrarFormulario ? "Cancelar" : "Nuevo Docente"}
                            </button>
                        </div>
                    </div>

                    {mostrarFormulario && (
                        <form onSubmit={handleSubmit} className="form-container">
                            <h3>{editando ? "Editar Docente" : "Registrar Nuevo Docente"}</h3>
                            <div className="form-group">
                                <label htmlFor="identificacion">Identificación:</label>
                                <input
                                    type="text"
                                    id="identificacion"
                                    name="identificacion"
                                    value={docente.identificacion}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Ej: 12345678"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="nombre">Nombre:</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={docente.nombre}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Nombre del docente"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Correo Electrónico:</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={docente.email}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="correo@ejemplo.com"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="especialidad">Especialidad:</label>
                                <input
                                    type="text"
                                    id="especialidad"
                                    name="especialidad"
                                    value={docente.especialidad}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Especialidad del docente"
                                />
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
                        <h3>Buscar Docentes</h3>
                        <div className="filtros-grupo">
                            <div className="form-group">
                                <label htmlFor="filtroNombre">Buscar por nombre, identificación o correo:</label>
                                <input
                                    type="text"
                                    id="filtroNombre"
                                    placeholder="Escribe para buscar..."
                                    value={filtroNombre}
                                    onChange={(e) => setFiltroNombre(e.target.value)}
                                />
                            </div>
                            <button 
                                className="btn-secondary"
                                onClick={() => setFiltroNombre("")}
                            >
                                Limpiar Filtro
                            </button>
                        </div>
                        <div className="estadisticas">
                            <h4>Información de Depuración:</h4>
                            <p><strong>Total de docentes cargados:</strong> {docentes.length}</p>
                            <p><strong>Docentes filtrados:</strong> {docentesFiltrados.length}</p>
                            <p><strong>URL de la API:</strong> http://localhost:8081/api/docentes</p>
                            <p><em>Abre la consola del navegador (F12) para ver más detalles</em></p>
                        </div>
                    </div>

                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Identificación</th>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Especialidad</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {docentesFiltrados.map(d => (
                                    <tr key={d.id}>
                                        <td>{d.id}</td>
                                        <td>{d.identificacion}</td>
                                        <td>{d.nombre}</td>
                                        <td>{d.email}</td>
                                        <td>{d.especialidad}</td>
                                        <td>
                                            <button 
                                                onClick={() => editarDocente(d)}
                                                className="btn-edit"
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                onClick={() => eliminarDocente(d.id)}
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
