package EduData.service;

import EduData.entity.Matricula;
import EduData.repository.MatriculaRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MatriculaServicio {

    @Autowired
    private MatriculaRepositorio matriculaRepositorio;

    public List<Matricula> obtenerTodas() {
        return matriculaRepositorio.findAll();
    }

    public Optional<Matricula> obtenerPorId(Long id) {
        return matriculaRepositorio.findById(id);
    }

    public Matricula crear(Matricula matricula) {
        return matriculaRepositorio.save(matricula);
    }

    public Matricula actualizar(Long id, Matricula matriculaActualizada) {
        return matriculaRepositorio.findById(id).map(m -> {
            m.setAnio(matriculaActualizada.getAnio());
            m.setEstudiante(matriculaActualizada.getEstudiante());
            m.setCurso(matriculaActualizada.getCurso());
            return matriculaRepositorio.save(m);
        }).orElse(null);
    }

    public void eliminar(Long id) {
        matriculaRepositorio.deleteById(id);
    }
}
