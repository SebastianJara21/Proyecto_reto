package EduData.controller;

import EduData.entity.Docente;
import EduData.service.DocenteServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/docentes")
@CrossOrigin
public class DocenteControlador {

    private final DocenteServicio servicio;

    public DocenteControlador(DocenteServicio servicio) {
        this.servicio = servicio;
    }

    @GetMapping
    public List<Docente> getAll() {
        return servicio.obtenerTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Docente> getById(@PathVariable Long id) {
        return servicio.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Docente create(@RequestBody Docente docente) {
        return servicio.crear(docente);
    }

    @PutMapping("/{id}")
    public Docente update(@PathVariable Long id, @RequestBody Docente docente) {
        return servicio.actualizar(id, docente);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        servicio.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}