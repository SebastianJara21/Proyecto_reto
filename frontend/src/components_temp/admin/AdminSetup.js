import React, { useState } from 'react';
import api from '../services/api';

const AdminSetup = () => {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');

    const checkUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/setup/check-users');
            setUsers(response.data.usuarios || []);
            setMessage(`Usuarios encontrados: ${response.data.totalUsuarios}`);
        } catch (error) {
            setMessage('Error al verificar usuarios: ' + error.message);
        }
        setLoading(false);
    };

    const initUsers = async () => {
        setLoading(true);
        try {
            const response = await api.post('/setup/init-users');
            setMessage(response.data.message);
            await checkUsers(); // Recargar la lista
        } catch (error) {
            setMessage('Error al inicializar usuarios: ' + error.message);
        }
        setLoading(false);
    };

    const testConnection = async () => {
        setLoading(true);
        try {
            const response = await api.get('/setup/test-connection');
            setMessage(response.data.message + ' - Total usuarios: ' + response.data.totalUsuarios);
        } catch (error) {
            setMessage('Error de conexión: ' + error.message);
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2>🔧 Configuración del Sistema</h2>
            
            <div style={{ marginBottom: '20px' }}>
                <button onClick={testConnection} disabled={loading} style={{ marginRight: '10px' }}>
                    {loading ? 'Probando...' : 'Probar Conexión BD'}
                </button>
                
                <button onClick={checkUsers} disabled={loading} style={{ marginRight: '10px' }}>
                    {loading ? 'Verificando...' : 'Verificar Usuarios'}
                </button>
                
                <button onClick={initUsers} disabled={loading}>
                    {loading ? 'Inicializando...' : 'Crear Usuarios'}
                </button>
            </div>

            {message && (
                <div style={{ 
                    padding: '10px', 
                    background: message.includes('Error') ? '#f8d7da' : '#d4edda',
                    color: message.includes('Error') ? '#721c24' : '#155724',
                    border: `1px solid ${message.includes('Error') ? '#f5c6cb' : '#c3e6cb'}`,
                    borderRadius: '5px',
                    marginBottom: '20px'
                }}>
                    {message}
                </div>
            )}

            {users.length > 0 && (
                <div>
                    <h3>Usuarios en la Base de Datos:</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8f9fa' }}>
                                <th style={{ border: '1px solid #dee2e6', padding: '8px' }}>ID</th>
                                <th style={{ border: '1px solid #dee2e6', padding: '8px' }}>Username</th>
                                <th style={{ border: '1px solid #dee2e6', padding: '8px' }}>Email</th>
                                <th style={{ border: '1px solid #dee2e6', padding: '8px' }}>Nombre</th>
                                <th style={{ border: '1px solid #dee2e6', padding: '8px' }}>Role</th>
                                <th style={{ border: '1px solid #dee2e6', padding: '8px' }}>Activo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>{user.id}</td>
                                    <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>{user.username}</td>
                                    <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>{user.email}</td>
                                    <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>{user.nombre} {user.apellido}</td>
                                    <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>{user.role}</td>
                                    <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>{user.enabled ? '✅' : '❌'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div style={{ marginTop: '30px', padding: '15px', background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '5px' }}>
                <h4>💡 Instrucciones:</h4>
                <ol>
                    <li><strong>Probar Conexión BD:</strong> Verifica que la base de datos esté funcionando</li>
                    <li><strong>Verificar Usuarios:</strong> Ve qué usuarios existen actualmente</li>
                    <li><strong>Crear Usuarios:</strong> Crea los usuarios por defecto (admin, docente, estudiante, invitado)</li>
                </ol>
                <p><strong>Usuarios por defecto:</strong></p>
                <ul>
                    <li>admin / admin123</li>
                    <li>docente / docente123</li>
                    <li>estudiante / estudiante123</li>
                    <li>invitado / guest123</li>
                </ul>
            </div>
        </div>
    );
};

export default AdminSetup;
