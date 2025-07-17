package EduData.controller;

import EduData.entity.Estudiante;
import EduData.service.EstudianteServicio;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/estudiantes")
@CrossOrigin(origins = "*")
public class EstudianteControlador {

    private static final Logger logger = LoggerFactory.getLogger(EstudianteControlador.class);
    private final EstudianteServicio servicio;

    public EstudianteControlador(EstudianteServicio servicio) {
        this.servicio = servicio;
    }

    @GetMapping
    public ResponseEntity<List<Estudiante>> getAll() {
        try {
            logger.info("Intentando obtener todos los estudiantes...");
            List<Estudiante> estudiantes = servicio.getAllStudents();
            logger.info("Se encontraron {} estudiantes", estudiantes.size());
            return ResponseEntity.ok(estudiantes);
        } catch (Exception e) {
            logger.error("Error al obtener estudiantes: ", e);
            // Devolver una lista vacía en caso de error de base de datos
            logger.warn("Devolviendo lista vacía debido a error de base de datos");
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Estudiante> getById(@PathVariable Long id) {
        try {
            logger.info("Buscando estudiante con ID: {}", id);
            return servicio.getStudentById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Error al buscar estudiante con ID {}: ", id, e);
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Estudiante> create(@RequestBody Estudiante estudiante) {
        try {
            logger.info("Creando nuevo estudiante: {}", estudiante.getNombre());
            Estudiante nuevo = servicio.createStudent(estudiante);
            return ResponseEntity.ok(nuevo);
        } catch (Exception e) {
            logger.error("Error al crear estudiante: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Estudiante> update(@PathVariable Long id, @RequestBody Estudiante estudiante) {
        try {
            logger.info("Actualizando estudiante con ID: {}", id);
            Estudiante actualizado = servicio.updateStudent(id, estudiante);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            logger.error("Error al actualizar estudiante con ID {}: ", id, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            logger.info("Eliminando estudiante con ID: {}", id);
            servicio.deleteStudent(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("Error al eliminar estudiante con ID {}: ", id, e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
