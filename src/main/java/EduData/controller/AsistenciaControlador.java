package EduData.controller;

import EduData.entity.Asistencia;
import EduData.service.AsistenciaServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/asistencias")
@CrossOrigin(origins = "*")
public class AsistenciaControlador {

    @Autowired
    private AsistenciaServicio asistenciaServicio;

    @GetMapping
    public List<Asistencia> listar() {
        return asistenciaServicio.obtenerTodas();
    }

    @GetMapping("/{id}")
    public Asistencia obtenerPorId(@PathVariable Long id) {
        return asistenciaServicio.obtenerPorId(id).orElse(null);
    }

    @PostMapping
    public Asistencia crear(@RequestBody Asistencia asistencia) {
        return asistenciaServicio.crear(asistencia);
    }

    @PutMapping("/{id}")
    public Asistencia actualizar(@PathVariable Long id, @RequestBody Asistencia asistencia) {
        return asistenciaServicio.actualizar(id, asistencia);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        asistenciaServicio.eliminar(id);
    }
}
