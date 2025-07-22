package EduData.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CursoDTO {
    private Long id;
    private String nombre;
    private String codigo;
    private String descripcion;
    private Integer anio;
    private String nombreDocente;
}
