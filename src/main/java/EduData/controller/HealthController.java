package EduData.controller;

import EduData.entity.Estudiante;
import EduData.service.EstudianteServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@CrossOrigin(origins = "*")
public class HealthController {

    @Autowired(required = false)
    private EstudianteServicio estudianteServicio;

    @GetMapping
    public Map<String, Object> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "Backend is running correctly");
        response.put("timestamp", System.currentTimeMillis());
        response.put("server", "Spring Boot");
        return response;
    }

    @GetMapping("/init-data")
    public Map<String, Object> initializeData() {
        Map<String, Object> response = new HashMap<>();
        try {
            if (estudianteServicio != null) {
                // Crear algunos estudiantes de prueba
                createSampleStudent("12345678", "Juan", "Pérez", "juan.perez@email.com");
                createSampleStudent("87654321", "María", "González", "maria.gonzalez@email.com");
                createSampleStudent("11111111", "Carlos", "Rodríguez", "carlos.rodriguez@email.com");
                
                response.put("status", "SUCCESS");
                response.put("message", "Datos de prueba creados correctamente");
            } else {
                response.put("status", "ERROR");
                response.put("message", "Servicio de estudiantes no disponible");
            }
        } catch (Exception e) {
            response.put("status", "ERROR");
            response.put("message", "Error al crear datos: " + e.getMessage());
        }
        return response;
    }

    private void createSampleStudent(String identificacion, String nombre, String apellido, String correo) {
        try {
            Estudiante estudiante = new Estudiante();
            estudiante.setIdentificacion(identificacion);
            estudiante.setNombre(nombre);
            estudiante.setApellido(apellido);
            estudiante.setCorreo(correo);
            estudiante.setFechaNacimiento(LocalDate.of(2000, 1, 1));
            estudiante.setGenero("Otro");
            estudiante.setTelefono("300-000-0000");
            estudiante.setDireccion("Dirección de ejemplo");
            
            estudianteServicio.createStudent(estudiante);
        } catch (Exception e) {
            // Ignorar si ya existe
            System.out.println("Error al crear estudiante (probablemente ya existe): " + e.getMessage());
        }
    }
}
