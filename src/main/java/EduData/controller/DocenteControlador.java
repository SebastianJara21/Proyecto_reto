package EduData.controller;

import EduData.entity.Docente;
import EduData.service.DocenteServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/docentes")
@CrossOrigin(origins = "*")
public class DocenteControlador {

    @Autowired
    private DocenteServicio docenteServicio;

    @GetMapping
    public List<Docente> listar() {
        return docenteServicio.obtenerTodos();
    }

    @GetMapping("/{id}")
    public Docente obtenerPorId(@PathVariable Long id) {
        return docenteServicio.obtenerPorId(id).orElse(null);
    }

    @PostMapping
    public Docente crear(@RequestBody Docente docente) {
        return docenteServicio.crear(docente);
    }

    @PutMapping("/{id}")
    public Docente actualizar(@PathVariable Long id, @RequestBody Docente docente) {
        return docenteServicio.actualizar(id, docente);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        docenteServicio.eliminar(id);
    }
}
