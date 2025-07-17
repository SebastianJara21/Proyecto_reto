package EduData.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Curso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String codigo;
    private String descripcion;
    private Integer anio;

    @ManyToOne
    @JoinColumn(name = "docente_id")
    private Docente docente;

    @OneToMany(mappedBy = "curso")
    @JsonIgnore
    private List<Matricula> matriculas;
}
