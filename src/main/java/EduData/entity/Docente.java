package EduData.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Docente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String email;
    private String especialidad;

    @OneToMany(mappedBy = "docente")
    @JsonIgnore  // Esto evita la serialización de la colección cursos
    private List<Curso> cursos;
}
