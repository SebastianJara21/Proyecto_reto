package EduData.controller;

import EduData.entity.Calificacion;
import EduData.service.CalificacionServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calificaciones")
@CrossOrigin(origins = "*")
public class CalificacionControlador {

    @Autowired
    private CalificacionServicio calificacionServicio;

    @GetMapping
    public List<Calificacion> listar() {
        return calificacionServicio.obtenerTodas();
    }

    @GetMapping("/{id}")
    public Calificacion obtenerPorId(@PathVariable Long id) {
        return calificacionServicio.obtenerPorId(id).orElse(null);
    }

    @PostMapping
    public Calificacion crear(@RequestBody Calificacion calificacion) {
        return calificacionServicio.crear(calificacion);
    }

    @PutMapping("/{id}")
    public Calificacion actualizar(@PathVariable Long id, @RequestBody Calificacion calificacion) {
        return calificacionServicio.actualizar(id, calificacion);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        calificacionServicio.eliminar(id);
    }
}
