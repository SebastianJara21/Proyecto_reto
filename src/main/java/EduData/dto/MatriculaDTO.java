package EduData.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatriculaDTO {
    private Long id;
    private Integer anio;
    private String nombreEstudiante;
    private String nombreCurso;
    private String codigoCurso;
}
