package EduData.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EstudianteDTO {
    private Long id;
    private String identificacion;
    private String nombre;
    private String apellido;
    private String correo;
    private String genero;
    private Integer matriculaAnio;
    private String estado;
    private String nivel;
    private String grupo;
}
