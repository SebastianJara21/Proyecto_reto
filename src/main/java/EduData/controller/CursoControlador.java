package EduData.controller;

import EduData.entity.Curso;
import EduData.service.CursoServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cursos")
@CrossOrigin(origins = "*")
public class CursoControlador {

    @Autowired
    private CursoServicio cursoServicio;

    @GetMapping
    public List<Curso> listar() {
        return cursoServicio.obtenerTodos();
    }

    @GetMapping("/{id}")
    public Curso obtenerPorId(@PathVariable Long id) {
        return cursoServicio.obtenerPorId(id).orElse(null);
    }

    @PostMapping
    public Curso crear(@RequestBody Curso curso) {
        return cursoServicio.crear(curso);
    }

    @PutMapping("/{id}")
    public Curso actualizar(@PathVariable Long id, @RequestBody Curso curso) {
        return cursoServicio.actualizar(id, curso);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        cursoServicio.eliminar(id);
    }
}
