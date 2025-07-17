package EduData.service;


import EduData.entity.Estudiante;
import EduData.repository.EstudianteRepositorio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EstudianteServicio {

    private final EstudianteRepositorio repositorio;

    public EstudianteServicio(EstudianteRepositorio repositorio) {
        this.repositorio = repositorio;
    }

    public List<Estudiante> getAllStudents() {
        return repositorio.findAll();
    }

    public Optional<Estudiante> getStudentById(Long id) {
        return repositorio.findById(id);
    }

    public Estudiante createStudent(Estudiante estudiante) {
        return repositorio.save(estudiante);
    }

    public Estudiante updateStudent(Long id, Estudiante updated) {
        return repositorio.findById(id).map(existing -> {
            updated.setId(existing.getId());
            return repositorio.save(updated);
        }).orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
    }

    public void deleteStudent(Long id) {
        repositorio.deleteById(id);
    }
}
