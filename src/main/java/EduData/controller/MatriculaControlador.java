package EduData.controller;

import EduData.entity.Matricula;
import EduData.service.MatriculaServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matriculas")
@CrossOrigin(origins = "*")
public class MatriculaControlador {

    @Autowired
    private MatriculaServicio matriculaServicio;

    @GetMapping
    public List<Matricula> listar() {
        return matriculaServicio.obtenerTodas();
    }

    @GetMapping("/{id}")
    public Matricula obtenerPorId(@PathVariable Long id) {
        return matriculaServicio.obtenerPorId(id).orElse(null);
    }

    @PostMapping
    public Matricula crear(@RequestBody Matricula matricula) {
        return matriculaServicio.crear(matricula);
    }

    @PutMapping("/{id}")
    public Matricula actualizar(@PathVariable Long id, @RequestBody Matricula matricula) {
        return matriculaServicio.actualizar(id, matricula);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        matriculaServicio.eliminar(id);
    }
}
