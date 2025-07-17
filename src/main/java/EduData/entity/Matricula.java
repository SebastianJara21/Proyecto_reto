package EduData.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Matricula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer anio;

    @ManyToOne
    @JoinColumn(name = "estudiante_id", nullable = false)
    private Estudiante estudiante;

    @ManyToOne
    @JoinColumn(name = "curso_id", nullable = false)
    private Curso curso;

    @OneToMany(mappedBy = "matricula", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Calificacion> calificaciones;

    @OneToMany(mappedBy = "matricula", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Asistencia> asistencias;
}
