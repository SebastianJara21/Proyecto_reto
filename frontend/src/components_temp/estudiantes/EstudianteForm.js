import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { authService } from "../services/authService";

export default function EstudianteForm() {
    const [estudiantes, setEstudiantes] = useState([]);
    const [estudiante, setEstudiante] = useState({
        identificacion: "",
        nombre: "",
        apellido: "",
        correo: "",
        fechaNacimiento: "",
        genero: "",
        telefono: "",
        direccion: ""
    });
    const [editando, setEditando] = useState(false);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [filtroNombre, setFiltroNombre] = useState("");

    useEffect(() => {
        console.log("Componente EstudianteForm montado");
        cargarEstudiantes();
    }, []);

    const cargarEstudiantes = async () => {
        try {
            console.log("Intentando cargar estudiantes...");
            const response = await api.get("/estudiantes");
            console.log("Respuesta del servidor:", response.data);
            setEstudiantes(response.data);
        } catch (error) {
            console.error("Error al cargar estudiantes:", error);
            // Mostrar más detalles del error
            if (error.response) {
                console.error("Error de respuesta:", error.response.status, error.response.data);
            } else if (error.request) {
                console.error("Error de red - no se recibió respuesta del servidor");
            } else {
                console.error("Error:", error.message);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editando) {
                await api.put(`/estudiantes/${estudiante.id}`, estudiante);
                alert("Estudiante actualizado correctamente");
            } else {
                await api.post("/estudiantes", estudiante);
                alert("Estudiante registrado correctamente");
            }
            resetFormulario();
            cargarEstudiantes();
        } catch (error) {
            console.error("Error al guardar estudiante:", error);
            alert("Error al guardar el estudiante");
        }
    };

    const editarEstudiante = (e) => {
        setEstudiante(e);
        setEditando(true);
        setMostrarFormulario(true);
    };

    const eliminarEstudiante = async (id) => {
        if (window.confirm("¿Está seguro de eliminar este estudiante?")) {
            try {
                await api.delete(`/estudiantes/${id}`);
                alert("Estudiante eliminado correctamente");
                cargarEstudiantes();
            } catch (error) {
                console.error("Error al eliminar estudiante:", error);
                alert("Error al eliminar el estudiante");
            }
        }
    };

    const resetFormulario = () => {
        setEstudiante({
            identificacion: "",
            nombre: "",
            apellido: "",
            correo: "",
            fechaNacimiento: "",
            genero: "",
            telefono: "",
            direccion: ""
        });
        setEditando(false);
        setMostrarFormulario(false);
    };

    // Función para manejar cambios en los inputs del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEstudiante(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Funciones para descargar PDF
    const descargarPDFTodos = async () => {
        try {
            const response = await api.get('/estudiantes/pdf', {
                responseType: 'blob'
            });
            
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'estudiantes.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error al descargar PDF:', error);
            alert('Error al descargar el PDF');
        }
    };

    const descargarPDFIndividual = async (id) => {
        try {
            const response = await api.get(`/estudiantes/${id}/pdf`, {
                responseType: 'blob'
            });
            
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `estudiante_${id}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error al descargar PDF:', error);
            alert('Error al descargar el PDF');
        }
    };

    const handleLogout = () => {
        authService.logout();
    };

    const currentUser = authService.getCurrentUser();

    // Filtrar estudiantes
    const estudiantesFiltrados = estudiantes.filter(e => {
        const cumpleNombre = !filtroNombre || 
            (e.nombre + " " + e.apellido).toLowerCase().includes(filtroNombre.toLowerCase()) ||
            e.identificacion.includes(filtroNombre) ||
            e.correo.toLowerCase().includes(filtroNombre.toLowerCase());
        return cumpleNombre;
    });

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div className="header-title">
                    <h1>Gestión de Estudiantes</h1>
                    <p>Administra los estudiantes del sistema educativo</p>
                </div>
                <div className="header-user">
                    {currentUser && (
                        <span>Bienvenido, {currentUser.username} ({currentUser.role})</span>
                    )}
                    <button onClick={handleLogout} className="btn-logout">
                        Cerrar Sesión
                    </button>
                </div>
                <nav>
                    <Link to="/">Inicio</Link>
                    <Link to="/estudiantes" className="active">Estudiantes</Link>
                    <Link to="/docentes">Docentes</Link>
                    <Link to="/matriculas">Matrículas</Link>
                    <Link to="/asistencias">Asistencias</Link>
                    <Link to="/calificaciones">Calificaciones</Link>
                    <Link to="/busqueda">Búsqueda</Link>
                </nav>
            </header>

            <main className="dashboard-main">
                <div className="form-section">
                    <div className="form-header">
                        <h2>Estudiantes Registrados</h2>
                        <div style={{display: 'flex', gap: '10px'}}>
                            <button 
                                className="btn-primary"
                                onClick={() => setMostrarFormulario(!mostrarFormulario)}
                            >
                                {mostrarFormulario ? "Cancelar" : "Nuevo Estudiante"}
                            </button>
                            <button 
                                className="btn-pdf"
                                onClick={descargarPDFTodos}
                                title="Descargar PDF de todos los estudiantes"
                            >
                                📄 PDF Todos
                            </button>
                        </div>
                    </div>

                    {mostrarFormulario && (
                        <form onSubmit={handleSubmit} className="form-container">
                            <h3>{editando ? "Editar Estudiante" : "Registrar Nuevo Estudiante"}</h3>
                            
                            <div className="form-group">
                                <label htmlFor="identificacion">Identificación:</label>
                                <input
                                    type="text"
                                    id="identificacion"
                                    name="identificacion"
                                    value={estudiante.identificacion}
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
                                    value={estudiante.nombre}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Nombre del estudiante"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="apellido">Apellido:</label>
                                <input
                                    type="text"
                                    id="apellido"
                                    name="apellido"
                                    value={estudiante.apellido}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Apellido del estudiante"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="correo">Correo Electrónico:</label>
                                <input
                                    type="email"
                                    id="correo"
                                    name="correo"
                                    value={estudiante.correo}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="correo@ejemplo.com"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="fechaNacimiento">Fecha de Nacimiento:</label>
                                <input
                                    type="date"
                                    id="fechaNacimiento"
                                    name="fechaNacimiento"
                                    value={estudiante.fechaNacimiento}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="genero">Género:</label>
                                <select
                                    id="genero"
                                    name="genero"
                                    value={estudiante.genero}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Seleccione el género</option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Femenino">Femenino</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="telefono">Teléfono:</label>
                                <input
                                    type="tel"
                                    id="telefono"
                                    name="telefono"
                                    value={estudiante.telefono}
                                    onChange={handleInputChange}
                                    placeholder="Ej: +57 300 123 4567"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="direccion">Dirección:</label>
                                <textarea
                                    id="direccion"
                                    name="direccion"
                                    value={estudiante.direccion}
                                    onChange={handleInputChange}
                                    rows="3"
                                    placeholder="Dirección completa del estudiante"
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
                        <h3>Buscar Estudiantes</h3>
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
                                Limpiar
                            </button>
                        </div>
                    </div>

                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Identificación</th>
                                    <th>Nombre Completo</th>
                                    <th>Correo</th>
                                    <th>Teléfono</th>
                                    <th>Género</th>
                                    <th>Fecha Nacimiento</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {estudiantesFiltrados.map(e => (
                                    <tr key={e.id}>
                                        <td>{e.id}</td>
                                        <td>{e.identificacion}</td>
                                        <td>{e.nombre} {e.apellido}</td>
                                        <td>{e.correo}</td>
                                        <td>{e.telefono || "No registrado"}</td>
                                        <td>{e.genero}</td>
                                        <td>{e.fechaNacimiento}</td>
                                        <td>
                                            <button 
                                                onClick={() => editarEstudiante(e)}
                                                className="btn-edit"
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                onClick={() => eliminarEstudiante(e.id)}
                                                className="btn-delete"
                                            >
                                                Eliminar
                                            </button>
                                            <button 
                                                onClick={() => descargarPDFIndividual(e.id)}
                                                className="btn-pdf"
                                                title="Descargar PDF del estudiante"
                                            >
                                                📄
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
