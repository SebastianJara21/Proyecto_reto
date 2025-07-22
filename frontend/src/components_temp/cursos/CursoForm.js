import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function CursoForm() {
    const [cursos, setCursos] = useState([]);
    const [docentes, setDocentes] = useState([]);
    const [curso, setCurso] = useState({
        nombre: "",
        codigo: "",
        descripcion: "",
        anio: new Date().getFullYear(),
        docente: { id: "" }
    });
    const [editando, setEditando] = useState(false);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [filtroNombre, setFiltroNombre] = useState("");

    useEffect(() => {
        cargarCursos();
        cargarDocentes();
    }, []);

    const cargarCursos = async () => {
        try {
            console.log("Cargando cursos...");
            const response = await api.get("/cursos");
            console.log("Cursos obtenidos:", response.data);
            setCursos(response.data);
        } catch (error) {
            console.error("Error al cargar cursos:", error);
        }
    };

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
            // Preparar datos del curso
            const cursoData = {
                nombre: curso.nombre,
                codigo: curso.codigo,
                descripcion: curso.descripcion,
                anio: parseInt(curso.anio),
                docente: curso.docente.id ? { id: curso.docente.id } : null
            };

            if (editando) {
                await api.put(`/cursos/${curso.id}`, cursoData);
                alert("Curso actualizado correctamente");
            } else {
                await api.post("/cursos", cursoData);
                alert("Curso creado correctamente");
            }
            resetFormulario();
            cargarCursos();
        } catch (error) {
            console.error("Error al guardar curso:", error);
            alert("Error al guardar el curso");
        }
    };

    const editarCurso = (cursoSeleccionado) => {
        setCurso({
            ...cursoSeleccionado,
            docente: { id: cursoSeleccionado.docente?.id || "" }
        });
        setEditando(true);
        setMostrarFormulario(true);
    };

    const eliminarCurso = async (id) => {
        if (window.confirm("¿Está seguro de eliminar este curso?")) {
            try {
                await api.delete(`/cursos/${id}`);
                alert("Curso eliminado correctamente");
                cargarCursos();
            } catch (error) {
                console.error("Error al eliminar curso:", error);
                alert("Error al eliminar el curso");
            }
        }
    };

    const resetFormulario = () => {
        setCurso({
            nombre: "",
            codigo: "",
            descripcion: "",
            anio: new Date().getFullYear(),
            docente: { id: "" }
        });
        setEditando(false);
        setMostrarFormulario(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "docenteId") {
            setCurso(prev => ({
                ...prev,
                docente: { id: value }
            }));
        } else {
            setCurso(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Filtrar cursos
    const cursosFiltrados = cursos.filter(c => {
        const cumpleNombre = !filtroNombre || 
            c.nombre.toLowerCase().includes(filtroNombre.toLowerCase()) ||
            c.codigo.toLowerCase().includes(filtroNombre.toLowerCase()) ||
            c.descripcion.toLowerCase().includes(filtroNombre.toLowerCase());
        return cumpleNombre;
    });

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Gestión de Cursos</h1>
                <p>Administra los cursos del sistema educativo</p>
                <nav>
                    <Link to="/">Inicio</Link>
                    <Link to="/estudiantes">Estudiantes</Link>
                    <Link to="/docentes">Docentes</Link>
                    <Link to="/cursos" className="active">Cursos</Link>
                    <Link to="/matriculas">Matrículas</Link>
                    <Link to="/asistencias">Asistencias</Link>
                    <Link to="/calificaciones">Calificaciones</Link>
                </nav>
            </header>

            <main className="dashboard-main">
                <div className="form-section">
                    <div className="form-header">
                        <h2>Cursos Registrados</h2>
                        <div style={{display: 'flex', gap: '10px'}}>
                            <button 
                                className="btn-primary"
                                onClick={() => setMostrarFormulario(!mostrarFormulario)}
                            >
                                {mostrarFormulario ? "Cancelar" : "Nuevo Curso"}
                            </button>
                            <button 
                                className="btn-secondary"
                                onClick={() => {
                                    console.log("Recargando cursos...");
                                    cargarCursos();
                                }}
                            >
                                Recargar
                            </button>
                        </div>
                    </div>

                    {mostrarFormulario && (
                        <form onSubmit={handleSubmit} className="form-container">
                            <h3>{editando ? "Editar Curso" : "Crear Nuevo Curso"}</h3>
                            
                            <div className="form-group">
                                <label htmlFor="nombre">Nombre del Curso:</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={curso.nombre}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Ej: Matemáticas Básicas"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="codigo">Código:</label>
                                <input
                                    type="text"
                                    id="codigo"
                                    name="codigo"
                                    value={curso.codigo}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Ej: MAT101"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="descripcion">Descripción:</label>
                                <textarea
                                    id="descripcion"
                                    name="descripcion"
                                    value={curso.descripcion}
                                    onChange={handleInputChange}
                                    rows="3"
                                    placeholder="Descripción del curso..."
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="anio">Año:</label>
                                <input
                                    type="number"
                                    id="anio"
                                    name="anio"
                                    value={curso.anio}
                                    onChange={handleInputChange}
                                    required
                                    min="2020"
                                    max="2030"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="docenteId">Docente (Opcional):</label>
                                <select
                                    id="docenteId"
                                    name="docenteId"
                                    value={curso.docente.id}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Sin docente asignado</option>
                                    {docentes.map(docente => (
                                        <option key={docente.id} value={docente.id}>
                                            {docente.nombre} {docente.apellido}
                                        </option>
                                    ))}
                                </select>
                                <small className="form-help">
                                    Puedes asignar un docente después
                                </small>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn-primary">
                                    {editando ? "Actualizar" : "Crear"}
                                </button>
                                <button type="button" onClick={resetFormulario} className="btn-secondary">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Filtros */}
                    <div className="filtros-container">
                        <h3>Buscar Cursos</h3>
                        <div className="filtros-grupo">
                            <div className="form-group">
                                <label htmlFor="filtroNombre">Buscar por nombre, código o descripción:</label>
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
                    </div>

                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Código</th>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Año</th>
                                    <th>Docente</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cursosFiltrados.length > 0 ? (
                                    cursosFiltrados.map(c => (
                                        <tr key={c.id}>
                                            <td>{c.id}</td>
                                            <td><strong>{c.codigo}</strong></td>
                                            <td>{c.nombre}</td>
                                            <td>{c.descripcion || "Sin descripción"}</td>
                                            <td>{c.anio}</td>
                                            <td>
                                                {c.docente ? 
                                                    `${c.docente.nombre} ${c.docente.apellido}` : 
                                                    <em>Sin asignar</em>
                                                }
                                            </td>
                                            <td>
                                                <button 
                                                    onClick={() => editarCurso(c)}
                                                    className="btn-edit"
                                                >
                                                    Editar
                                                </button>
                                                <button 
                                                    onClick={() => eliminarCurso(c.id)}
                                                    className="btn-delete"
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>
                                            No hay cursos registrados. 
                                            <button 
                                                onClick={() => setMostrarFormulario(true)}
                                                className="btn-primary"
                                                style={{marginLeft: '10px'}}
                                            >
                                                Crear el primer curso
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
