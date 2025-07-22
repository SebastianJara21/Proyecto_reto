import api from './api';

// Servicio para manejar las consultas de búsqueda inteligente
export const busquedaService = {
    // Realizar consulta en lenguaje natural
    consultarNLQ: async (pregunta) => {
        try {
            const response = await api.post('/nlq/pregunta', pregunta, {
                headers: {
                    'Content-Type': 'text/plain',
                },
            });
            return response.data;
        } catch (error) {
            throw new Error(`Error en la consulta: ${error.response?.data?.message || error.message}`);
        }
    },

    // Obtener estadísticas rápidas del sistema
    obtenerEstadisticas: async () => {
        try {
            const [estudiantes, cursos, docentes, matriculas] = await Promise.all([
                api.get('/estudiantes'),
                api.get('/cursos'),
                api.get('/docentes'),
                api.get('/matriculas')
            ]);

            return {
                totalEstudiantes: estudiantes.data.length,
                totalCursos: cursos.data.length,
                totalDocentes: docentes.data.length,
                totalMatriculas: matriculas.data.length
            };
        } catch (error) {
            console.error('Error obteniendo estadísticas:', error);
            return {
                totalEstudiantes: 0,
                totalCursos: 0,
                totalDocentes: 0,
                totalMatriculas: 0
            };
        }
    },

    // Obtener datos de todos los estudiantes para análisis
    obtenerTodosEstudiantes: async () => {
        try {
            const response = await api.get('/estudiantes');
            return response.data;
        } catch (error) {
            throw new Error(`Error obteniendo estudiantes: ${error.message}`);
        }
    }
};

export default busquedaService;
