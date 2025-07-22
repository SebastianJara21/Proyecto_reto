import React, { useState } from 'react';
import { authService } from '../services/authService';
import '../Layout/Dashboard.css';

const Login = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        nombre: '',
        apellido: '',
        role: 'INVITADO'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                await authService.login({
                    username: formData.username,
                    password: formData.password
                });
            } else {
                await authService.register(formData);
            }
            onLogin();
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleGuestLogin = async () => {
        setLoading(true);
        setError('');
        
        try {
            await authService.loginAsGuest();
            onLogin();
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</h2>
                
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            name="username"
                            placeholder="Nombre de usuario"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {!isLogin && (
                        <>
                            <div className="form-group">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Correo electrónico"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <input
                                    type="text"
                                    name="nombre"
                                    placeholder="Nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <input
                                    type="text"
                                    name="apellido"
                                    placeholder="Apellido"
                                    value={formData.apellido}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="INVITADO">Invitado</option>
                                    <option value="ESTUDIANTE">Estudiante</option>
                                    <option value="DOCENTE">Docente</option>
                                </select>
                            </div>
                        </>
                    )}

                    <button type="submit" disabled={loading} className="submit-btn">
                        {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
                    </button>
                </form>

                <div className="auth-options">
                    <button 
                        onClick={() => setIsLogin(!isLogin)}
                        className="link-btn"
                    >
                        {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
                    </button>

                    <button 
                        onClick={handleGuestLogin}
                        disabled={loading}
                        className="guest-btn"
                    >
                        Entrar como Invitado
                    </button>
                </div>

                {isLogin && (
                    <div className="demo-users">
                        <h3>👥 Usuarios de Prueba</h3>
                        <div className="user-list">
                            <div className="user-demo">
                                <strong>👨‍💼 Administrador:</strong> admin / admin123
                            </div>
                            <div className="user-demo">
                                <strong>👩‍🏫 Docente:</strong> docente / docente123
                            </div>
                            <div className="user-demo">
                                <strong>👨‍🎓 Estudiante:</strong> estudiante / estudiante123
                            </div>
                            <div className="user-demo">
                                <strong>👤 Invitado:</strong> invitado / guest123
                            </div>
                        </div>
                        <p className="demo-note">
                            💡 <em>Puedes usar cualquiera de estas credenciales o hacer click en "Entrar como Invitado"</em>
                        </p>
                        <p className="demo-note">
                            🔧 <a href="/setup" style={{color: '#007bff'}}>¿Los usuarios no funcionan? Configurar Sistema</a>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
