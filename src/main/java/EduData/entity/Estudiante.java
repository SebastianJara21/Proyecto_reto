package EduData.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Estudiante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String identificacion;
    
    private String nombre;
    private String apellido;
    
    @Column(unique = true)
    private String correo;
    
    private LocalDate fechaNacimiento;
    private String genero;
    private String telefono;
    private String direccion;
    
    // Campos adicionales del sistema académico
    private Integer matriculaAnio;
    private String estado;
    private String nivel;
    private String grupo;

    @OneToMany(mappedBy = "estudiante", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Matricula> matriculas;
}
