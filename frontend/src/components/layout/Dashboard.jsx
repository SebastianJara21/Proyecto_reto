import React from "react";
import "./Dashboard.css";
import { Link } from "react-router-dom";

export default function Dashboard() {
    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>EduData</h1>
                <p>Sistema Académico Inteligente</p>
                <nav>
                    <a href="#">Inicio</a>
                    <Link to="/estudiantes">Estudiantes</Link>
                    <a href="#">Asistencia</a>
                    <a href="#">Calificaciones</a>
                    <a href="#">Matrículas</a>
                    <a href="#">Docentes</a>
                    <a href="#">Cursos</a>
                </nav>
            </header>

            <main className="dashboard-main">
                <section className="dashboard-section">
                    <h2>Módulos Principales</h2>
                    <div className="card-container">
                        <div className="card">
                            <div className="card-icon">📚</div>
                            <h3>Estudiantes</h3>
                            <p>Gestor completo de estudiantes, perfiles y datos académicos.</p>
                            <Link to="/estudiantes">
                                <button>Acceder</button>
                            </Link>
                        </div>
                        <div className="card">
                            <div className="card-icon">📝</div>
                            <h3>Asistencia</h3>
                            <p>Control detallado de la asistencia diaria y reportes.</p>
                            <button>Acceder</button>
                        </div>
                        <div className="card">
                            <div className="card-icon">💯</div>
                            <h3>Calificaciones</h3>
                            <p>Registro y consulta de notas, promedios y desempeño.</p>
                            <button>Acceder</button>
                        </div>
                        <div className="card">
                            <div className="card-icon">🏫</div>
                            <h3>Matrículas</h3>
                            <p>Administración de periodos lectivos, cursos y asignaciones.</p>
                            <button>Acceder</button>
                        </div>
                    </div>
                </section>

                <section className="dashboard-section admin-section">
                    <h2>Gestión Administrativa</h2>
                    <div className="card-container">
                        <div className="card">
                            <div className="card-icon">👨‍🏫</div>
                            <h3>Docentes</h3>
                            <p>Administra el personal docente, sus asignaciones y horarios.</p>
                            <button>Gestionar</button>
                        </div>
                        <div className="card">
                            <div className="card-icon">📚</div>
                            <h3>Cursos y Materias</h3>
                            <p>Configura y organiza los cursos, materias y currículums.</p>
                            <button>Gestionar</button>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="dashboard-footer">
                <p>© 2025 EduData. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
}
