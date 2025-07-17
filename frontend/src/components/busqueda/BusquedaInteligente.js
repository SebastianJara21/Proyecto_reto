import React, { useState, useEffect } from 'react';
import busquedaService from '../services/busquedaService';
import './BusquedaInteligente.css';

const BusquedaInteligente = () => {
    const [pregunta, setPregunta] = useState('');
    const [resultados, setResultados] = useState([]);
    const [jpqlGenerado, setJpqlGenerado] = useState('');
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');
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
        "Estudiantes cuyo nombre contenga 'Juan'",
        "Cursos de matemáticas",
        "Estudiantes matriculados en el 2024",
        "Docentes especializados en ciencias",
        "Estudiantes con correo que contenga 'gmail'",
        "Cursos del año 2023"
    ];

    const realizarBusqueda = async () => {
        if (!pregunta.trim()) {
            setError('Por favor ingresa una pregunta');
            return;
        }

        setCargando(true);
        setError('');
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

        // Si es un conteo simple
        if (resultados.length === 1 && typeof resultados[0] === 'number') {
            return (
                <div className="resultado-conteo">
                    <h3>Resultado:</h3>
                    <div className="numero-resultado">{resultados[0]}</div>
                </div>
            );
        }

        // Si son objetos de estudiantes o entidades
        if (resultados.length > 0 && typeof resultados[0] === 'object') {
            const keys = Object.keys(resultados[0]);
            
            return (
                <div className="tabla-resultados">
                    <h3>Resultados encontrados: {resultados.length}</h3>
                    <div className="tabla-container">
                        <table className="tabla">
                            <thead>
                                <tr>
                                    {keys.map(key => (
                                        <th key={key}>{key}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {resultados.map((item, index) => (
                                    <tr key={index}>
                                        {keys.map(key => (
                                            <td key={key}>
                                                {item[key] !== null && item[key] !== undefined 
                                                    ? String(item[key]) 
                                                    : '-'}
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

        // Para otros tipos de resultados
        return (
            <div className="resultados-lista">
                <h3>Resultados:</h3>
                <ul>
                    {resultados.map((item, index) => (
                        <li key={index}>{JSON.stringify(item)}</li>
                    ))}
                </ul>
            </div>
        );
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
