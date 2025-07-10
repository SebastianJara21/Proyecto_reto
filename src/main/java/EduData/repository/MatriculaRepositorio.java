package EduData.repository;

import EduData.entity.Matricula;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatriculaRepositorio extends JpaRepository<Matricula, Long> {
}
