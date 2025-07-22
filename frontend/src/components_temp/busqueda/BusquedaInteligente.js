import React, { useState, useEffect } from 'react';
import busquedaService from '../services/busquedaService';
import './BusquedaInteligente.css';

const BusquedaInteligente = () => {
    const [pregunta, setPregunta] = useState('');
    const [resultados, setResultados] = useState([]);
    const [jpqlGenerado, setJpqlGenerado] = useState('');
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');
    const [sugerencia, setSugerencia] = useState('');
    const [estadisticas, setEstadisticas] = useState({
        totalEstudiantes: 0,
        totalCursos: 0,
        totalDocentes: 0,
        totalMatriculas: 0
    });

    // Cargar estadísticas al montar el componente
    useEffect(() => {
        cargarEstadisticas();
    }, []);

    const cargarEstadisticas = async () => {
        try {
            const stats = await busquedaService.obtenerEstadisticas();
            setEstadisticas(stats);
        } catch (error) {
            console.error('Error cargando estadísticas:', error);
        }
    };

    const ejemplosPregunta = [
        "¿Cuántos estudiantes hay en total?",
        "Estudiantes del año 2024",
        "Estudiantes de género masculino",
        "Estudiantes de género femenino", 
        "Cursos de matemáticas",
        "¿Cuántos docentes hay?",
        "Docentes especializados en informática",
        "Estudiantes matriculados en 2024",
        "Matriculas del año 2024",
        "Datos de Sebastian Figueroa",
        "Cursos que tiene Sebastian",
        "Estudiantes en cursos de matemáticas"
    ];

    const realizarBusqueda = async () => {
        if (!pregunta.trim()) {
            setError('Por favor ingresa una pregunta');
            return;
        }

        setCargando(true);
        setError('');
        setSugerencia('');
        setResultados([]);
        setJpqlGenerado('');

        try {
            const data = await busquedaService.consultarNLQ(pregunta);

            // Si hay error en la respuesta
            if (data && data.length > 0 && data[0].error) {
                setError(data[0].error);
                if (data[0].jpql) {
                    setJpqlGenerado(data[0].jpql);
                }
                if (data[0].sugerencia) {
                    setSugerencia(data[0].sugerencia);
                }
            } else {
                setResultados(data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    const usarEjemplo = (ejemplo) => {
        setPregunta(ejemplo);
    };

    const renderResultados = () => {
        if (resultados.length === 0) return null;

        // Si es un conteo simple o resultado numérico
        if (resultados.length === 1) {
            const resultado = resultados[0];
            
            // Verificar si es un resultado numérico
            if (resultado.resultado !== undefined) {
                return (
                    <div className="resultado-conteo">
                        <h3>Resultado:</h3>
                        <div className="numero-resultado">{resultado.resultado}</div>
                    </div>
                );
            }
            
            // Verificar si es un valor simple
            if (resultado.valor !== undefined) {
                return (
                    <div className="resultado-valor">
                        <h3>Resultado:</h3>
                        <div className="valor-resultado">{resultado.valor}</div>
                    </div>
                );
            }
        }

        // Si son objetos de entidades
        if (resultados.length > 0 && typeof resultados[0] === 'object') {
            // Obtener todas las claves únicas de todos los resultados
            const todasLasClaves = new Set();
            resultados.forEach(item => {
                Object.keys(item).forEach(key => {
                    const value = item[key];
                    // Solo incluir campos que tienen valores útiles
                    if (value !== null && 
                        value !== undefined && 
                        value !== 'N/A' && 
                        !key.includes('password') &&
                        !key.includes('token') &&
                        !key.includes('error')) {
                        todasLasClaves.add(key);
                    }
                });
            });

            const keys = Array.from(todasLasClaves);
            
            if (keys.length > 0) {
                return (
                    <div className="tabla-resultados">
                        <h3>Resultados encontrados: {resultados.length}</h3>
                        <div className="tabla-container">
                            <table className="tabla">
                                <thead>
                                    <tr>
                                        {keys.map(key => (
                                            <th key={key}>{formatearNombreColumna(key)}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultados.map((item, index) => (
                                        <tr key={index}>
                                            {keys.map(key => (
                                                <td key={key}>
                                                    {formatearValorCelda(item[key])}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            }
        }

        // Para casos donde no podemos renderizar como tabla
        return (
            <div className="resultado-generico">
                <h3>Resultados:</h3>
                <div className="resultados-cards">
                    {resultados.map((item, index) => (
                        <div key={index} className="resultado-card">
                            <h4>Resultado {index + 1}</h4>
                            {Object.entries(item).map(([key, value]) => (
                                <div key={key} className="campo-valor">
                                    <strong>{formatearNombreColumna(key)}:</strong> {formatearValorCelda(value)}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const formatearNombreColumna = (key) => {
        const nombres = {
            'id': 'ID',
            'identificacion': 'Identificación',
            'nombre': 'Nombre',
            'apellido': 'Apellido',
            'correo': 'Correo',
            'email': 'Email',
            'genero': 'Género',
            'matriculaAnio': 'Año Matrícula',
            'estado': 'Estado',
            'nivel': 'Nivel',
            'grupo': 'Grupo',
            'especialidad': 'Especialidad',
            'codigo': 'Código',
            'descripcion': 'Descripción',
            'anio': 'Año',
            'info': 'Información'
        };
        return nombres[key] || key.charAt(0).toUpperCase() + key.slice(1);
    };

    const formatearValorCelda = (valor) => {
        if (valor === null || valor === undefined) {
            return '-';
        }
        if (typeof valor === 'boolean') {
            return valor ? 'Sí' : 'No';
        }
        if (typeof valor === 'string' && valor.includes('@')) {
            return <a href={`mailto:${valor}`}>{valor}</a>;
        }
        if (typeof valor === 'object') {
            // Si es un objeto, intentar mostrar información útil
            if (valor.nombre) return valor.nombre;
            if (valor.id) return `ID: ${valor.id}`;
            return JSON.stringify(valor);
        }
        return String(valor);
    };

    return (
        <div className="busqueda-inteligente">
            <div className="header">
                <h1>Búsqueda Inteligente</h1>
                <p>Haz preguntas en lenguaje natural sobre estudiantes, cursos y más</p>
            </div>

            {/* Sección de estadísticas rápidas */}
            <div className="estadisticas-section">
                <h2>📊 Vista General del Sistema</h2>
                <div className="estadisticas-grid">
                    <div className="estadistica-card">
                        <div className="estadistica-numero">{estadisticas.totalEstudiantes}</div>
                        <div className="estadistica-label">Estudiantes</div>
                    </div>
                    <div className="estadistica-card">
                        <div className="estadistica-numero">{estadisticas.totalCursos}</div>
                        <div className="estadistica-label">Cursos</div>
                    </div>
                    <div className="estadistica-card">
                        <div className="estadistica-numero">{estadisticas.totalDocentes}</div>
                        <div className="estadistica-label">Docentes</div>
                    </div>
                    <div className="estadistica-card">
                        <div className="estadistica-numero">{estadisticas.totalMatriculas}</div>
                        <div className="estadistica-label">Matrículas</div>
                    </div>
                </div>
            </div>

            <div className="busqueda-section">
                <div className="input-group">
                    <textarea
                        value={pregunta}
                        onChange={(e) => setPregunta(e.target.value)}
                        placeholder="Escribe tu pregunta aquí... ej: ¿Cuántos estudiantes hay del año 2024?"
                        className="pregunta-input"
                        rows="3"
                    />
                    <button 
                        onClick={realizarBusqueda}
                        disabled={cargando}
                        className="buscar-btn"
                    >
                        {cargando ? '🔄 Buscando...' : '🚀 Buscar'}
                    </button>
                </div>

                <div className="ejemplos-section">
                    <h3>Ejemplos de preguntas:</h3>
                    <div className="ejemplos-grid">
                        {ejemplosPregunta.map((ejemplo, index) => (
                            <button
                                key={index}
                                onClick={() => usarEjemplo(ejemplo)}
                                className="ejemplo-btn"
                            >
                                {ejemplo}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {error && (
                <div className="error-section">
                    <h3>⚠️ Error:</h3>
                    <p>{error}</p>
                    {jpqlGenerado && (
                        <div className="jpql-generado">
                            <h4>JPQL generado por la IA:</h4>
                            <code>{jpqlGenerado}</code>
                        </div>
                    )}
                    {sugerencia && (
                        <div className="sugerencia">
                            <h4>💡 Sugerencia:</h4>
                            <p>{sugerencia}</p>
                        </div>
                    )}
                </div>
            )}

            {cargando && (
                <div className="loading-section">
                    <div className="loader"></div>
                    <p>La IA está procesando tu pregunta...</p>
                </div>
            )}

            {renderResultados()}
        </div>
    );
};

export default BusquedaInteligente;
