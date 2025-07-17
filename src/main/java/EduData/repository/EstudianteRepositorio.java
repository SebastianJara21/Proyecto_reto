package EduData.repository;



import EduData.entity.Estudiante;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EstudianteRepositorio extends JpaRepository<Estudiante, Long> {
}