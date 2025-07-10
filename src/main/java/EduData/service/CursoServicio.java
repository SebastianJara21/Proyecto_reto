package EduData.service;

import EduData.entity.Curso;
import EduData.repository.CursoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CursoServicio {

    @Autowired
    private CursoRepositorio cursoRepositorio;

    public List<Curso> obtenerTodos() {
        return cursoRepositorio.findAll();
    }

    public Optional<Curso> obtenerPorId(Long id) {
        return cursoRepositorio.findById(id);
    }

    public Curso crear(Curso curso) {
        return cursoRepositorio.save(curso);
    }

    public Curso actualizar(Long id, Curso cursoActualizado) {
        return cursoRepositorio.findById(id).map(curso -> {
            curso.setNombre(cursoActualizado.getNombre());
            curso.setCodigo(cursoActualizado.getCodigo());
            curso.setDescripcion(cursoActualizado.getDescripcion());
            curso.setAnio(cursoActualizado.getAnio());
            curso.setDocente(cursoActualizado.getDocente());
            return cursoRepositorio.save(curso);
        }).orElse(null);
    }

    public void eliminar(Long id) {
        cursoRepositorio.deleteById(id);
    }
}
